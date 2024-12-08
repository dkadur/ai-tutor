import prisma from "@/lib/prisma";
import { getExamAttemptSection } from "../functions/section/getExamAttemptSection";

export const storeExamAttemptState = async (
  attemptId: string,
  sectionId: string,
  timeRemaining: number
) => {
  try {
    const examAttemptSection = await getExamAttemptSection(
      attemptId,
      sectionId
    );

    await prisma.exam_attempt_sections.update({
      where: {
        attempt_section_id: examAttemptSection?.attempt_section_id,
      },
      data: {
        current_section_time_left: timeRemaining,
      },
    });
  } catch (error) {
    throw new Error("Failed to store attempt state");
  }
};
