import prisma from "@/lib/prisma";

export const getNextSection = async (attempt_id: string, currentSection: any) => {
  try {
    const nextSection = await prisma.exam_attempt_sections.findFirst({
      where: {
        attempt_id: parseInt(attempt_id),
        section_order: {
          gt: currentSection?.section_order!
        }
      },
      orderBy: {
        section_order: 'asc'
      },
      include: {
        sections: {
          select: {
            type: true,
          }
        }
      },
    });

    return nextSection;
  } catch (error) {
    throw new Error("Failed to fetch current exam" + error);
  }
};
