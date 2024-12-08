import { ExamForm } from "@/components/feature/exam/exam-form";
import ExamLayout from "@/components/feature/exam/exam-layout";

import { submitQuestion } from "@/server/actions/submitQuestion";
import { getQuestion } from "@/server/functions";
import { getExamAttemptStatus } from "@/server/functions/exam/getExamAttemptStatus";
import { verifyExamAttempt } from "@/server/functions/exam/verifyExamAttempt";

import prisma from "@/lib/prisma";
import { isAllowed } from "@/lib/utils";
import { adminUserId } from "@/types";
import { questions } from "@prisma/client";

import { ControlProvider } from "@/components/providers/ControlContext";

export default async function QuestionPage({
  params,
}: {
  params: { exam_id: string; attempt_id: string; section_id: string; question_number: string };
}) {
  const { attempt_id, section_id, question_number } = params;
  const isAsTeacher = isAllowed(["teacher", "superadmin", "t-admin"]);
  const userId = adminUserId;

  try {
    if (!isAsTeacher) {
      await verifyExamAttempt(attempt_id);
    }
  } catch (error) {
    return <p>You are trying to access a question that is not available for your profile</p>
  }
  const { question, totalQuestions, questionNumber, section, sectionQuestionsStatus } = await getQuestion({
    examId: params.exam_id,
    attemptId: attempt_id,
    sectionId: section_id,
    questionNumber: question_number,
  });

  const { isExamCompleted, isExamReal } = await getExamAttemptStatus(attempt_id);
  const sections = await prisma.exam_attempt_sections.findMany({
    where: {
      attempt_id: parseInt(attempt_id),
    },
    orderBy: {
      section_order: "asc",
    },
    include: {
      sections: {
        select: {
          section_id: true,
          name: true,
        },
      },
    },
  });

  const simplifiedSections = sections.map(section => ({
    section_id: section.sections.section_id,
    name: section.sections.name,
  }));

  const ogQuestion = question?.question!;

  const choices = [
    {
      text: "A",
      value: ogQuestion.choice_a,
      image: ogQuestion.choice_a_image,
      isEliminated: false,
    },
    {
      text: "B",
      value: ogQuestion.choice_b,
      image: ogQuestion.choice_b_image,
      isEliminated: false,
    },
    {
      text: "C",
      value: ogQuestion.choice_c,
      image: ogQuestion.choice_c_image,
      isEliminated: false,
    },
    {
      text: "D",
      value: ogQuestion.choice_d!,
      image: ogQuestion.choice_d_image,
      isEliminated: false,
    },
  ];

  const submitQuestionWithAdditionalArgs = submitQuestion.bind(null, params.exam_id, attempt_id, section_id, `${question!.question_id}`);

  const isLastQuestion = questionNumber === totalQuestions;
  const isBackButtonDisabled = questionNumber === 1;

  const ogLocQuestion: questions = (await prisma.questions.findFirst({
    where: {
      question_id: ogQuestion.question_id,
    },
  }))!;

  return (
    <ControlProvider>
      <ExamLayout
        sectionName={section?.name}
        attempt_id={attempt_id}
        isExamOver={isExamCompleted}
        isExamReal={isExamReal}
        isLastQuestion={isLastQuestion}
        isBackButtonDisabled={isBackButtonDisabled}
        totalQuestions={totalQuestions}
        sectionQuestionsStatus={sectionQuestionsStatus}
        sections={simplifiedSections}
        questionNumber={questionNumber!}
        questionId={ogQuestion.question_id}
        answer={ogLocQuestion.correct_answer}

      >
        <ExamForm
          ogLocQuestion={ogLocQuestion}
          question={ogQuestion}
          sectionType={section?.type!}
          action={submitQuestionWithAdditionalArgs}
          choices={choices}
          userAnswer={question!.user_answer}
          isExamOver={isExamCompleted}
          isExamReal={isExamReal}
        />
      </ExamLayout>
    </ControlProvider>
  );
}
