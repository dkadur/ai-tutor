import prisma from "@/lib/prisma";

const CACHE_EXPIRY = 60 * 60;

export const getExamAttempt = async (examId: number, attemptId: number) => {
  try {
    const result = await prisma.exam_attempts.findUnique({
      where: { attempt_id: attemptId },
      select: { status: true, user_id: true },
    });
    return result;
  } catch (error) {
    console.error(`Error accessing database for exam attempt ${attemptId}:`, error);
  }
};

export const getQuestionData = async (examId: number, sectionId: number, questionId: number) => {
  try {
    const result = await prisma.questions.findUnique({
      where: { question_id: questionId },
      select: { correct_answer: true },
    });
    return result;
  } catch (error) {
    console.error(`Error accessing database for question ${questionId}:`, error);
  }
};

export const getCurrentSection = async (attemptId: number, sectionId: number) => {
  const cacheKey = `current-section-${attemptId}-${sectionId}`;
  try {
    const result = await prisma.exam_attempt_sections.findFirst({
      where: {
        attempt_id: attemptId,
        section_id: sectionId
      },
      select: {
        attempt_section_id: true,
        current_section_time_left: true,
        total_questions: true,
        section_id: true,
        sections: {
          select: {
            type: true,
          }
        }
      },
    });
    return result;
  } catch (error) {
    console.error(`Error accessing database for current section ${sectionId}:`, error);
  }
};