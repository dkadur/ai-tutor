import prisma from "@/lib/prisma";

interface GetSectionScoreArgs {
  attemptId: string;
  sectionId: string;
}

export const getSectionScore = async ({ attemptId, sectionId }: GetSectionScoreArgs) => {
  const questions = await prisma.exam_attempt_questions.findMany({
    where: {
      attempt_id: parseInt(attemptId),
      section_id: parseInt(sectionId),
    },
  });

  const correctQuestions = questions.filter((question) => question.is_correct);

  const totalQuestions = questions.length;
  const totalCorrect = correctQuestions.length;

  const score = (totalCorrect / totalQuestions) * 100;

  return {
    totalQuestions,
    totalCorrect,
    score,
    correctQuestions,
  };
};
