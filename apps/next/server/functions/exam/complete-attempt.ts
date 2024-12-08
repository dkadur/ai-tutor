"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';

import { saveExamAttemptScore } from '@/server/actions/saveExamAttemptScore';
import { verifyExamAttempt } from '@/server/functions/exam/verifyExamAttempt';
import prisma from '@/lib/prisma';
import { adminUserId } from '@/types';
import { updateTimeCompleteSection } from '../section/updateTimeCompleteSection';
export const completeAttempt = async (exam_id: string, attempt_id: string, timeRemaining: number) => {
  const userId = adminUserId;

  await verifyExamAttempt(attempt_id);

  await prisma.exam_attempts.update({
    where: {
      attempt_id: parseInt(attempt_id),
    },
    data: {
      end_time: new Date(),
      status: "completed",
    },
  });

  const attempt = await prisma.exam_attempts.findFirst({
    where: {
      attempt_id: parseInt(attempt_id),
    },
    include: {
      exams: true,
    },
  });

  const currentAttemptSection = await prisma.exam_attempt_sections.findFirst({
    where: {
      attempt_id: parseInt(attempt_id),
    },
    orderBy: {
      section_order: 'desc'
    }
  });


  await updateTimeCompleteSection(currentAttemptSection?.attempt_section_id!, timeRemaining);

  const allMarkedQuestions = await prisma.exam_attempt_questions.findMany({
    where: {
      attempt_id: parseInt(attempt_id),
      marked_for_review: true
    },
    select: {
      question: {
        select: {
          question_id: true,
        }
      }
    }
  });

  const allSkippedQuestions = await prisma.exam_attempt_questions.findMany({
    where: {
      attempt_id: parseInt(attempt_id),
      is_answered: false
    },
    select: {
      question: {
        select: {
          question_id: true,
        }
      }
    }
  });

  const allWrongAnsweredQuestions = await prisma.exam_attempt_questions.findMany({
    where: {
      attempt_id: parseInt(attempt_id),
      is_correct: false
    },
    select: {
      question: {
        select: {
          question_id: true,
        }
      }
    }
  });

  const allQuestionsForReview = allMarkedQuestions.concat(allSkippedQuestions).concat(allWrongAnsweredQuestions);

  await prisma.missed_and_flagged_questions.createMany({
    data: allQuestionsForReview.map((question) => ({
      user_id: userId,
      question_id: question.question.question_id,
      exam_id: parseInt(exam_id),
      exam_type: attempt?.exams.exam_type
    })),
    skipDuplicates: true
  });

  await saveExamAttemptScore(attempt_id);
  redirect("/dashboard");
}