import prisma from "@/lib/prisma";
import { ExamType } from "@wolfietutor/types";

export const getAllExams = async (exam_type: ExamType) => {
  try {
    const examsFromDb = await prisma.exams.findMany({
      where: {
        completed: true,
        is_archived: false,
        exam_type: exam_type
      },
      orderBy: {
        exam_id: "asc",
      }
    });

    return examsFromDb;
  } catch (error) {
    console.error("Error fetching exams from the database:", error);
    throw error;
  }
};
