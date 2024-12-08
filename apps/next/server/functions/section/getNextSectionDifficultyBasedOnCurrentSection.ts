import prisma from "@/lib/prisma";
import { getExamTypeCookie } from "@/server/actions/setExamTypeCookie";
import { ExamConfig } from "@/types";

export const getNextSectionDifficultyBasedOnCurrentSection = async (
  sectionId: number,
  sectionType: string,
  attemptId: number
) => {
  try {
    const examType = await getExamTypeCookie();
    const examConfig = await prisma.exam_config.findFirst({
      where: {
        exam_type: examType
      }
    }) as ExamConfig;
    const minCorrectCount = examConfig?.config.sections.find((section) => section.type === sectionType)?.correct_count!;
    const correctCount = await prisma.exam_attempt_questions.count({
      where: {
        attempt_id: attemptId,
        section_id: sectionId,
        is_correct: true,
      },
    });

    if (correctCount <= minCorrectCount) {
      return "easy";
    }

    return "hard";
  } catch (error) {
    throw new Error("Could not get second section difficulty");
  }
};
