"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const invalidateExamAttempt = async (
  exam_id: string,
  attempt_id: string,
  section_id: string
) => {
  try {
    await prisma.exam_attempts.update({
      where: {
        attempt_id: parseInt(attempt_id),
      },
      data: {
        is_real: false,
      },
    });

    revalidatePath(`/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/question/`);
  } catch (error) {
    throw new Error("Failed to invalidate exam attempt");
  }
};
