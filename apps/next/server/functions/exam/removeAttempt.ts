"use server";
import prisma from "@/lib/prisma";
import { getExamTypeCookie } from "@/server/actions/setExamTypeCookie";
import { revalidatePath } from "next/cache";
import { adminUserId } from "@/types";

export const removeAttempt = async (attemptId: number) => {
  if (!attemptId) {
    throw new Error("Missing attemptId");
  }

  const userId = adminUserId;
  const examType = await getExamTypeCookie();
  const status = "in_progress";

  try {
    await prisma.exam_attempt_questions.deleteMany({
      where: {
        attempt_id: attemptId
      }
    });

    await prisma.exam_attempt_sections.deleteMany({
      where: {
        attempt_id: attemptId
      }
    });


    // 3. delete all exam_attempts
    await prisma.exam_attempts.delete({
      where: {
        attempt_id: attemptId
      }
    });

    revalidatePath('/attempt/current');
  } catch (error) {
    throw new Error("Failed to delete exam attempt" + error);
  }
};