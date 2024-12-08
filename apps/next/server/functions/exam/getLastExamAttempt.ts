"use server";

import prisma from "@/lib/prisma";

import { getSection } from "../section/getSection";
import { ExamType } from "@wolfietutor/types";
import { adminUserId } from "@/types";

export const getLastExamAttempt = async (exam_type: ExamType, userId?: string) => {
  const user_id = adminUserId;

  try {
    const lastAttempt = await prisma.exam_attempts.findFirst({
      where: {
        user_id: user_id as string,
        status: "in_progress",
        exams: {
          exam_type: exam_type || "dsat"
        }
      },
      orderBy: {
        start_time: "desc",
      },
    });

    if (!lastAttempt) {
      return null;
    }

    const exam = await prisma.exams.findFirst({
      where: {
        exam_id: lastAttempt?.exam_id!,
      },
    });

    const lastAttemptSection = await getSection(
      lastAttempt?.current_section_id!
    );

    if (!lastAttemptSection) {
      return null;
    }

    return {
      ...lastAttempt,
      sectionName: lastAttemptSection?.name,
      examName: exam?.name,
    };
  } catch (error: any) {
    throw new Error("Failed to fetch last attempt details.", error);
  }
};