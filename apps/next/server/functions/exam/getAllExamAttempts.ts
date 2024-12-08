import prisma from "@/lib/prisma";
import { ExamType } from "@wolfietutor/types";
import { exam_attempt_sections, exam_attempts } from "@prisma/client";
import { adminUserId } from "@/types";

interface ExamAttemptSectionsWithSections extends exam_attempt_sections {
  sections: {
    name: string;
  }
}

interface ExamAttemptsWithDetails extends exam_attempts {
  exams: {
    name: string;
  };
  exam_attempt_sections: ExamAttemptSectionsWithSections[];
}

export const getAllExamAttempts = async (examType: ExamType, status: "in_progress" | "completed") => {
  const userId = adminUserId;

  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  const allAttempts: ExamAttemptsWithDetails[] = await prisma.exam_attempts.findMany({
    where: {
      user_id: userId,
      exams: {
        exam_type: examType
      },
      status,
    },
    orderBy: status === "completed" ? {
      end_time: "desc"
    } : {
      start_time: "desc"
    },
    include: {
      exams: {
        select: {
          name: true
        }
      },
      exam_attempt_sections: {
        include: {
          sections: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  if (!allAttempts) {
    return null;
  }

  const allAttemptsWithDetails = allAttempts.map(attempt => {
    const section = attempt.exam_attempt_sections.find(section => section.section_id === attempt.current_section_id)?.sections;

    return {
      ...attempt,
      sectionName: section?.name || "---",
      examName: attempt.exams.name,
    };
  });

  return allAttemptsWithDetails;
};
