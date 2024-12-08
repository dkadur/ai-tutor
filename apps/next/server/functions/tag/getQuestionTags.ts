import prisma from "@/lib/prisma";

export async function getTagsForQuestion(questionId: number): Promise<number[]> {
  // Fetch the relationship data between questions and tags
  const questionTags = await prisma.question_tags.findMany({
    where: {
      question_id: questionId,
    },
    include: {
      tags: true,
    },
  });

  const tagIds = questionTags.map(qt => qt.tags.tag_id);
  return tagIds;
}