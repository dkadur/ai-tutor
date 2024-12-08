import prisma from "@/lib/prisma";
import { adminUserId } from "@/types";

export const getUserExamPerformance = async () => {
  const userId = adminUserId;

  if (!userId) {
    throw new Error("User unauthenticated");
  }

  const examAttempts = await prisma.exam_attempts.findMany({
    where: {
      user_id: userId,
      status: "completed",
    },
    orderBy: {
      start_time: "asc",
    },
  });

  const examPerformances = examAttempts.map((attempt) => ({
    is_real: attempt.is_real,
    start_time: attempt.start_time,
    rw_score: attempt.reading_writing_score,
    math_score: attempt.math_score,
    total_score: attempt.total_score,
  }));

  return examPerformances;
};
