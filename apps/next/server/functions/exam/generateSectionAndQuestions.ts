"use server";

import prisma from '@/lib/prisma';
import { sections } from '@prisma/client';

export async function generateSectionAndQuestions(section: sections, examId: number, attemptId: number) {
  try {
    const questions = await prisma.questions.findMany({
      where: {
        section_id: section.section_id,
        exam_id: examId,
      },
      select: {
        question_id: true,
        question_order: true,
      }
    });

    const totalSections = await prisma.exam_attempt_sections.count({
      where: {
        attempt_id: attemptId,
      },
    });

    const attempt = await prisma.exam_attempts.findFirst({
      where: {
        attempt_id: attemptId,
      },
    });

    // Create the section in the exam attempt
    await prisma.exam_attempt_sections.create({
      data: {
        attempt_id: attemptId,
        section_id: section.section_id,
        current_section_time_left: attempt?.is_long ? section.time_limit! * 1.5 : section.time_limit,
        total_questions: questions.length,
        section_order: totalSections + 1,
      },
    });

    // Use transaction for batch creating questions
    await prisma.$transaction(
      questions.map(question => {
        return prisma.exam_attempt_questions.create({
          data: {
            question_id: question.question_id,
            attempt_id: attemptId,
            section_id: section.section_id,
            question_number: question.question_order!,
          },
        });
      })
    );
  } catch (error) {
    console.error(error);
  }
}
