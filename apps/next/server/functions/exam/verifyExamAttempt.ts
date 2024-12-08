import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { adminUserId } from "@/types";

export const verifyExamAttempt = async (attemptId: string) => {
  const userId = adminUserId;
  const attempt = await prisma.exam_attempts.findFirst({
    where: {
      attempt_id: parseInt(attemptId),
    },
    select: {
      user_id: true,
    }
  });

  if (attempt?.user_id !== userId) {
    return redirect("/invalid-access");
  }
};