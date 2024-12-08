import prisma from "@/lib/prisma";

// Fetch a section associated with a section_id
export const getSection = async (section_id: number) => {
  const section = await prisma.sections.findFirst({
    where: {
      section_id: section_id,
    },
  });

  return section;
};
