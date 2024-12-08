"use server";

import prisma from "@/lib/prisma";

export const getExamAttemptSection = async (
  attemptId: string,
  sectionId: string
) => {
  const section = await prisma.exam_attempt_sections.findFirst({
    where: {
      attempt_id: parseInt(attemptId),
      section_id: parseInt(sectionId),
    },
  });

  return section;
};
