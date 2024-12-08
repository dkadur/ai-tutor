"use client";
import { useContext, useEffect, useState } from 'react';

import NextSectionHandler from "@/components/client/NextSectionHandler";
import { TimerContext } from "@/components/providers/TimerContext";

import { completeAttempt } from "@/server/functions/exam/complete-attempt";

import { updateTimeRemaining } from '@/server/functions/question/updateTimeRemaining';

export const SectionSummaryClient = ({
  currentSection,
  section,
  sectionQuestionsStatus,
  numberOfQuestionsRemaining,
  isLastSection,
  isBreakNeeded,
  breakLink,
  actionMessage,
  isExamCompleted,
  isExamReal,
  exam_id,
  attempt_id,
  section_id,
  user_id,
  total_questions,
}: {
  currentSection: any;
  section: any;
  sectionQuestionsStatus: {
    is_answered: boolean;
    question_number: number;
    marked_for_review: boolean;
  }[];
  numberOfQuestionsRemaining: number;
  isLastSection: boolean;
  isBreakNeeded: boolean;
  breakLink: string;
  actionMessage: string;
  isExamCompleted: boolean;
  isExamReal: boolean;
  exam_id: string;
  attempt_id: string;
  section_id: string;
  user_id: string | undefined;
  total_questions: number | undefined | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { remainingTime } = useContext(TimerContext);

  const handleCompleteAttempt = async () => {
    setIsLoading(true);
    await completeAttempt(exam_id, attempt_id, remainingTime);
  };

  useEffect(() => {
    async function saveRemainingTime() {
      try {
        await updateTimeRemaining(
          parseInt(attempt_id),
          parseInt(section_id),
          remainingTime
        );
      } catch (error) {
        console.error("Failed to save remaining time:", error);
      }
    }

    if (!isExamCompleted) {
      const beforeUnloadHandler = async (event: BeforeUnloadEvent) => {
        event.preventDefault();
        await saveRemainingTime();
        event.returnValue = ""; // Required for Chrome
      };

      window.addEventListener("beforeunload", beforeUnloadHandler);

      return () => {
        window.removeEventListener("beforeunload", beforeUnloadHandler);
      };
    }
  }, [attempt_id, section_id, remainingTime]);

  return (
    <section className="flex flex-col items-center justify-center h-full gap-3">
      <p className="text-2xl">Click to {actionMessage === "Finish Exam" ? "complete" : "continue"} the exam</p>
      <NextSectionHandler
        attempt_section_id={currentSection?.attempt_section_id!}
        actionMessage={actionMessage}
        navigationLink={breakLink}
        user_id={user_id!}
        total_questions={total_questions!}
        section_id={parseInt(section_id)}
        attempt_id={parseInt(attempt_id)}
        exam_id={parseInt(exam_id)}
        isLastSection={isLastSection}
        isLoading={isLoading}
        isBreakNeeded={isBreakNeeded}
        handleCompleteAttempt={handleCompleteAttempt}
      />
    </section>
  );
};
