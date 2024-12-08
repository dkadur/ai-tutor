import prisma from "@/lib/prisma";
import { adminUserId } from "@/types";

export const getLatestQuestion = async (examId: string) => {
  const userId = adminUserId;

  if (!userId) {
    throw new Error("User unauthenticated");
  }

  const exam_id = parseInt(examId);

  try {
    const lastQuestion = await prisma.exam_attempts.findFirst({
      where: {
        user_id: userId,
        exam_id: exam_id,
      },
      orderBy: {
        start_time: "desc",
      },
      include: {
        // Include the associated ExamQuestions and order them by a relevant field
        exam_attempt_questions: {
          orderBy: {
            question_number: "desc", // Order by a relevant field indicating the question's position
          },
          take: 1, // Retrieve only the latest question
        },
      },
    });

    if (lastQuestion) {
      return lastQuestion.exam_attempt_questions[0];
    } else {
      //No attempts found for the specified user and exam.
      return null; // Or handle the absence of attempts accordingly
    }
  } catch (error) {
    throw new Error("Failed to fetch last question details.");
  }
};
