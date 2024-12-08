
import { redirect } from 'next/navigation';

import { getCurrentExam } from '@/server/functions/exam/getCurrentExam';
import { getNextSection } from '@/server/functions/section/getNextSection';
import { getSection } from '@/server/functions/section/getSection';
import { getSectionQuestionStatus } from '@/server/functions/section/getSectionQuestionsStatus';

import prisma from '@/lib/prisma';
import { ExamConfig } from '@/types';
import { SectionSummaryClient } from './section-summary.client';

export default async function SectionSummary({ params }: { params: { exam_id: string, attempt_id: string, section_id: string } }) {
  const { exam_id, attempt_id, section_id } = params;

  const currentExam = await getCurrentExam(exam_id, attempt_id, section_id);
  const user_id = currentExam?.user_id;
  const currentSection = currentExam?.exam_attempt_sections[0];
  const total_questions = currentSection?.total_questions;

  const examConfig = await prisma.exam_config.findFirst({
    where: {
      exam_type: currentExam?.exams.exam_type
    }
  }) as ExamConfig;
  const nextSection = examConfig.config.sections.find((section) => section.order === currentSection?.section_order! + 1);

  const isExamCompleted = currentExam?.status === "completed";
  const isExamReal = Boolean(currentExam?.is_real);

  if (isExamCompleted) {
    const nextExistingSection = await getNextSection(attempt_id, currentSection);
    if (!nextExistingSection) return redirect("/dashboard");
    return redirect(`/exam/${exam_id}/attempt/${attempt_id}/section/${nextExistingSection?.section_id}/question/1`);
  }
  const section = await getSection(parseInt(section_id));
  const sectionQuestionsStatus = await getSectionQuestionStatus(attempt_id, section_id);
  const numberOfQuestionsRemaining = sectionQuestionsStatus.filter(({ is_answered }) => !is_answered).length;
  const isLastSection = currentSection?.section_order === examConfig.config.total_sections;
  const isBreakNeeded = false;
  const breakLink = `/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/end`

  const actionMessage = isLastSection ? "Finish Exam" : "Go to the next section";

  return (
    <SectionSummaryClient
      currentSection={currentSection}
      section={section}
      sectionQuestionsStatus={sectionQuestionsStatus}
      numberOfQuestionsRemaining={numberOfQuestionsRemaining}
      isLastSection={isLastSection}
      isBreakNeeded={isBreakNeeded}
      breakLink={breakLink}
      actionMessage={actionMessage}
      isExamCompleted={isExamCompleted}
      isExamReal={isExamReal}
      exam_id={exam_id}
      attempt_id={attempt_id}
      section_id={section_id}
      user_id={user_id}
      total_questions={total_questions}
    />
  );
}