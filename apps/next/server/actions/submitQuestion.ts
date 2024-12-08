import prisma from "@/lib/prisma";
import {
  getCurrentSection,
  getExamAttempt,
  getQuestionData,
} from "../cache/submitQuestionCache";
import { revalidatePath } from "next/cache";
import { isCorrectAnswer } from "@/lib/utils";
import { AttemptType } from "@wolfietutor/types";

const availableAnswers = ["a", "b", "c", "d"];

export const submitQuestion = async (
  exam_id: string,
  attemptId: string,
  sectionId: string,
  questionId: string,
  section_time_left: number,
  formData: FormData
) => {
  "use server";
  const [examIdInt, attemptIdInt, sectionIdInt, questionIdInt] = [
    exam_id,
    attemptId,
    sectionId,
    questionId,
  ].map((id) => parseInt(id));

  const answer = formData.get("answer") as string;
  const isAnswered = answer !== "";

  const start = Date.now();

  const [examAttempt, questionData, currentSection, question] =
    await Promise.all([
      getExamAttempt(examIdInt, attemptIdInt),
      getQuestionData(examIdInt, sectionIdInt, questionIdInt),
      getCurrentSection(attemptIdInt, sectionIdInt),
      prisma.exam_attempt_questions.findFirst({
        where: {
          attempt_id: parseInt(attemptId),
          section_id: parseInt(sectionId),
          question_id: parseInt(questionId),
        },
      }),
    ]);

  const isLastQuestion =
    question?.question_number === currentSection?.total_questions;

  if (examAttempt?.status == "completed")
    throw new Error("Exam attempt has already been completed");

  const isCorrect = isCorrectAnswer(answer, questionData?.correct_answer!);

  await prisma.$transaction([
    prisma.exam_attempt_sections.update({
      where: {
        attempt_id: attemptIdInt,
        section_id: sectionIdInt,
        attempt_section_id: currentSection?.attempt_section_id,
      },
      data: {
        current_section_time_left: section_time_left,
      },
    }),
    prisma.exam_attempt_questions.update({
      where: {
        attempt_question_id: question?.attempt_question_id,
      },
      data: {
        is_answered: isAnswered,
        user_answer: answer,
        is_correct: isCorrect,
        time_stamp: section_time_left,
      },
    }),
  ]);

  if (!isLastQuestion) {
    await prisma.exam_attempts.update({
      where: {
        attempt_id: parseInt(attemptId),
      },
      data: {
        current_question_id: question!.question_number + 1,
      },
    });
  }
  // this is left on purpose to see how much time it takes to submit a question
  const end = Date.now();
  console.log(`Time taken to submit question: ${end - start}ms`);
  revalidatePath(
    `app/exam/${exam_id}/attempt/${attemptId}/section/${sectionId}/question/${question?.question_number}`,
    "page"
  );
};
