"use server";
import { redirect } from 'next/navigation';

import { getExamTypeCookie } from '@/server/actions/setExamTypeCookie';
import {
  getNextSectionDifficultyBasedOnCurrentSection
} from '@/server/functions/section/getNextSectionDifficultyBasedOnCurrentSection';

import prisma from '@/lib/prisma';
import { sections } from '@prisma/client';

export const generateNewSection = async (exam_id: number, attempt_id: number, current_section_id: number) => {
  let futureNextSection;
  try {
    if (isNaN(exam_id) || isNaN(attempt_id) || isNaN(current_section_id)) {
      throw new Error('Invalid exam ID, attempt ID, or section ID');
    }

    const attempt = await prisma.exam_attempts.findFirst({
      where: {
        attempt_id: attempt_id,
      },
      include: {
        exams: {
          select: {
            exam_type: true
          }
        }
      }
    });

    const examType = attempt?.exams.exam_type;

    const allAttemptSection = await prisma.exam_attempt_sections.findMany({
      where: {
        attempt_id: attempt_id,
      },
      include: {
        sections: {
          select: {
            type: true,
          }
        }
      }
    });

    const currentAttemptSection = allAttemptSection.find(section => section.section_id === current_section_id);
    const isNextSectionOrderExist = allAttemptSection.some(section => section.section_order! > currentAttemptSection?.section_order!);


    if (isNextSectionOrderExist) {
      const sortedAttemptSection = allAttemptSection.sort((a, b) => a.section_order! - b.section_order!);
      const nextSection = sortedAttemptSection.find(section => section.section_order! > currentAttemptSection?.section_order!);
      futureNextSection = nextSection;
      return;
    }

    const nextPossibleSections = await prisma.sections.findMany({
      where: {
        section_order: currentAttemptSection?.section_order! + 1,
        exam_type: examType,
      },
    });

    let nextSection: sections | null | undefined = null;

    if (nextPossibleSections.length === 2) {
      const difficulty = await getNextSectionDifficultyBasedOnCurrentSection(currentAttemptSection?.section_id!, currentAttemptSection?.sections.type!, attempt_id);

      nextSection = nextPossibleSections.find(section => section.difficulty_level === difficulty);
    } else if (nextPossibleSections.length === 1) {
      nextSection = nextPossibleSections[0];
    }

    if (!nextSection || !nextSection?.section_id) {
      throw new Error("No next section available");
    }

    const questions = await prisma.questions.findMany({
      where: {
        section_id: nextSection?.section_id!,
        exam_id: exam_id,
      },
    });

    await prisma.$transaction([
      prisma.exam_attempt_sections.create({
        data: {
          attempt_id: attempt_id,
          section_id: nextSection?.section_id!,
          current_section_time_left: attempt?.is_long ? nextSection?.time_limit! * 1.5 : nextSection?.time_limit,
          total_questions: questions.length,
          section_order: currentAttemptSection?.section_order! + 1,
        },
      }),
      prisma.exam_attempts.update({
        where: {
          attempt_id: attempt_id,
        },
        data: {
          current_section_id: nextSection?.section_id!,
          current_question_id: 1,
        },
      }),
      prisma.exam_attempt_sections.update({
        where: {
          attempt_id: attempt_id,
          section_id: current_section_id,
          attempt_section_id: currentAttemptSection?.attempt_section_id,
        },
        data: {
          current_section_time_left: 0,
        },
      }),
      ...questions.map(question => prisma.exam_attempt_questions.create({
        data: {
          question_id: question.question_id,
          attempt_id: attempt_id,
          section_id: nextSection?.section_id!,
          question_number: question.question_order!,
        },
      }))
    ]);
    futureNextSection = nextSection;
  } catch (error: any) {
    throw new Error("Failed to generate new section", error);
  } finally {
    redirect(`/exam/${exam_id}/attempt/${attempt_id}/section/${futureNextSection?.section_id}/question/1`);
  }
};
