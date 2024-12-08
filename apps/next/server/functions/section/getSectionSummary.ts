import prisma from "@/lib/prisma";

interface GetSectionSummaryArgs {
  examId: string;
  attemptId: string;
  sectionId: string;
}

export const getSectionSummary = async ({
  attemptId,
  sectionId,
}: GetSectionSummaryArgs) => {
  let examAttempt;
  try {
    examAttempt = await prisma.exam_attempts.findFirst({
      where: {
        attempt_id: parseInt(attemptId),
      },
      include: {
        exam_attempt_questions: {
          select: {
            section_id: true,
            is_correct: true,
            is_answered: true,
            time_stamp: true,
            question_number: true,
          },
        },
        exam_attempt_sections: {
          include: {
            sections: true,
          },
        },
      }
    });
  } catch (error) {
    console.error("Could not get section summary", error);
    throw new Error("Could not get section summary");
  }
  const sectionAttempt = examAttempt?.exam_attempt_sections.find((section) => section.section_id === parseInt(sectionId));
  const currentSection = sectionAttempt?.sections;
  const totalQuestions = examAttempt?.exam_attempt_questions.filter((question) => question.section_id === parseInt(sectionId)).length;
  const totalCorrect = examAttempt?.exam_attempt_questions.filter((question) => question.section_id === parseInt(sectionId) && question.is_correct).length;
  const score = (totalCorrect! / totalQuestions!) * 100;
  const sectionQuestions = examAttempt?.exam_attempt_questions.filter((question) => question.section_id === parseInt(sectionId));
  const totalMissed = examAttempt?.exam_attempt_questions.filter((question) => question.section_id === parseInt(sectionId) && !question.is_answered).length;
  const timeLeftOnComplete = sectionAttempt?.time_left_on_complete;

  return {
    sectionName: currentSection?.name,
    section: currentSection,
    examAttempt,
    totalQuestions,
    totalCorrect,
    score,
    sectionQuestions,
    totalMissed,
    timeLeftOnComplete
  };
};
