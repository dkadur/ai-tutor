import prisma from "@/lib/prisma";
import { getSectionQuestionStatus } from "../section/getSectionQuestionsStatus";
import { getSection } from "../section/getSection";
import { question_tags, questions, tags } from "@prisma/client";

interface getQuestionArgs {
  examId: string;
  attemptId: string;
  sectionId: string;
  questionNumber: string;
}

interface QuestionTagsWithTags extends question_tags {
  tags: tags;
}

interface QuestionWithTags extends questions {
  question_tags: QuestionTagsWithTags[];
}

export const getQuestion = async ({
  examId,
  attemptId,
  sectionId,
  questionNumber,
}: getQuestionArgs) => {
  const mainQuestionData = await prisma.questions.findFirst({
    where: {
      exam_id: parseInt(examId),
      section_id: parseInt(sectionId),
      question_order: parseInt(questionNumber),
    },
    include: {
      question_tags: {
        include: {
          tags: true,
        }
      }
    }
  });

  const attemptQuestionPromise = prisma.exam_attempt_questions.findFirst({
    where: {
      attempt_id: parseInt(attemptId),
      section_id: parseInt(sectionId),
      question_number: parseInt(questionNumber),
    },
    select: {
      user_answer: true,
      question_number: true,
      question_id: true,
      marked_for_review: true,
    },
  });

  const totalQuestionsPromise = prisma.exam_attempt_questions.count({
    where: {
      attempt_id: parseInt(attemptId),
      section_id: parseInt(sectionId),
    },
  });

  const section = await getSection(parseInt(sectionId));
  const totalSectionsPromise = prisma.exam_attempt_sections.count({
    where: {
      attempt_id: parseInt(attemptId),
    },
  });

  const questionsWithStatus = await getSectionQuestionStatus(
    attemptId,
    sectionId
  );

  const [mainQuestionDataResult, attemptQuestion, totalQuestions, totalSections] = await Promise.all([
    mainQuestionData,
    attemptQuestionPromise,
    totalQuestionsPromise,
    totalSectionsPromise,
  ]);

  const question = {
    ...attemptQuestion,
    question: mainQuestionDataResult,
  };

  return {
    question,
    questionNumber: question?.question_number,
    totalQuestions,
    totalSections,
    section,
    sectionQuestionsStatus: questionsWithStatus,
  };
};
