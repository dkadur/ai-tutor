import prisma from "@/lib/prisma";
import { adminUserId } from "@/types";

export const getUserQuestionPerformance = async (questionId: string) => {
  const userId = adminUserId;

  if (!userId) {
    throw new Error("User unauthenticated");
  }

  try {
    const totalUserQuestions = await prisma.exam_attempt_questions.findMany({
      where: {
        question_id: parseInt(questionId),
      },
      select: {
        exam_attempts: {
          select: {
            user_id: true
          }
        },
        is_correct: true
      }
    });
    const totalUserCorrectCount = totalUserQuestions.filter(question => question.is_correct).length;
    const totalUserTotalCount = totalUserQuestions.length;
    const totalUserCorrectPercentage = totalUserTotalCount > 0 ? (totalUserCorrectCount / totalUserTotalCount) * 100 : 0;

    const currentUserQuestions = totalUserQuestions.filter(question => question.exam_attempts.user_id === userId);
    const currentUserCorrectCount = currentUserQuestions.filter(question => question.is_correct).length;
    const currentUserTotalCount = currentUserQuestions.length;
    const currentUserCorrectPercentage = currentUserTotalCount > 0 ? (currentUserCorrectCount / currentUserTotalCount) * 100 : 0;

    return {
      currentUserCorrectPercentage: currentUserCorrectPercentage,
      totalUserCorrectPercentage: totalUserCorrectPercentage
    }
  } catch (error) {
    throw new Error("Error retrieving data");
  }
}