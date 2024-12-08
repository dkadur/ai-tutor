"use server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { generateSectionAndQuestions } from "@/server/functions/exam/generateSectionAndQuestions";
import { adminUserId } from "@/types";

export const createAttempt = async (exam_id: number, is_long: boolean) => {
  const userId = adminUserId;
  const exam = await prisma.exams.findFirst({
    where: {
      exam_id: exam_id,
    },
  });

  const firstSection = await prisma.sections.findFirst({
    where: {
      section_order: 1,
      exam_type: exam?.exam_type,
    },
  });

  const examAttempt = await prisma.exam_attempts.create({
    data: {
      user_id: userId!,
      exam_id: exam_id,
      current_section_id: firstSection?.section_id,
      is_long: is_long,
    },
  });

  await generateSectionAndQuestions(firstSection!, exam_id, examAttempt.attempt_id);

  if (!firstSection || !examAttempt) {
    throw new Error("Failed to create attempt");
  }

  redirect(`/exam/${exam_id}/attempt/${examAttempt.attempt_id}/section/${firstSection?.section_id}/question/1`);
}