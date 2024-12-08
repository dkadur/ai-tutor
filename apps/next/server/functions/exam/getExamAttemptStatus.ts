import prisma from "@/lib/prisma";

export const getExamAttemptStatus = async (exam_attempt_id: string) => {
  try {
    const attempt = await prisma.exam_attempts.findFirst({
      where: {
        attempt_id: parseInt(exam_attempt_id),
      },
    });

    const isExamCompleted = attempt?.status === "completed";

    return {
      isExamCompleted,
      isExamReal: Boolean(attempt?.is_real),
    };
  } catch (error) {
    throw new Error("Failed to fetch exam attempt status.");
  }
};
