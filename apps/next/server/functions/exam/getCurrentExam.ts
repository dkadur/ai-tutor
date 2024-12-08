import prisma from "@/lib/prisma";

export const getCurrentExam = async (exam_id: string, attempt_id: string, section_id: string) => {
  try {
    const currentExam = await prisma.exam_attempts.findFirst({
      where: {
        exam_id: parseInt(exam_id),
        attempt_id: parseInt(attempt_id),
      },
      include: {
        exam_attempt_sections: {
          where: {
            attempt_id: parseInt(attempt_id),
            section_id: parseInt(section_id),
          },
          include: {
            sections: {
              select: {
                type: true,
              }
            }
          }
        },
        exams: {
          select: {
            name: true,
            exam_type: true,
          }
        },
      },
    });

    return currentExam;
  } catch (error) {
    throw new Error("Failed to fetch current exam" + error);
  }
};
