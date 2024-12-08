import prisma from "@/lib/prisma";

export const getSectionQuestionStatus = async (
  attemptId: string,
  sectionId: string
) => {
  try {
    const sectionQuestionsStatus = await prisma.exam_attempt_questions.findMany({
      where: {
        attempt_id: parseInt(attemptId),
        section_id: parseInt(sectionId),
      },
      select: {
        is_answered: true,
        question_number: true,
        marked_for_review: true,
      },
      orderBy: {
        question_number: "asc",
      },
    });

    return sectionQuestionsStatus;
  } catch (error) {
    throw new Error(
      "Failed to fetch section questions status."
    );
  }
};
