"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface QuestionArgs {
  examId: string;
  attemptId: string;
  sectionId: string;
  questionId: number;
}

export const setMarkedForReview = async ({
  examId,
  attemptId,
  sectionId,
  questionId,
}: QuestionArgs, isMarked: boolean) => {
  try {
    const question = await prisma.exam_attempt_questions.findFirst({
      where: {
        attempt_id: parseInt(attemptId),
        section_id: parseInt(sectionId),
        question_id: questionId,
      },
    });

    await prisma.exam_attempt_questions.update({
      where: {
        attempt_question_id: question?.attempt_question_id,
      },
      data: {
        marked_for_review: isMarked,
      },
    });

    revalidatePath(`app/exam/${examId}/attempt/${attemptId}/section/${sectionId}/question/${question?.question_number}`,
    "page");
  } catch (error) {
    throw new Error(
      "Failed to set marked for review."
    );
  }
};