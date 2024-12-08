"use client";

import ExitButton from "../../client/ExitButton";
import { ExamNavigation } from "./exam-navigation";
import ExamControl from "@/components/client/ExamControl";
import { useControlContext } from "@/components/providers/ControlContext";

interface ExamLayoutProps {
  children: React.ReactNode;
  sectionName?: string;
  attempt_id?: string;
  isExamOver: boolean;
  isExamReal: boolean;
  isLastQuestion: boolean;
  isBackButtonDisabled: boolean;
  totalQuestions: number;
  sectionQuestionsStatus: { is_answered: boolean; question_number: number; marked_for_review: boolean }[];
  sections: { section_id: number; name: string }[];
  questionNumber: number;
  questionId?: number;
  answer?: string;
}

export default function ExamLayout({
  children,
  sectionName,
  isExamOver,
  isExamReal,
  isLastQuestion,
  isBackButtonDisabled,
  totalQuestions,
  sectionQuestionsStatus,
  sections,
  questionNumber,
  questionId,
  answer,
}: ExamLayoutProps) {
  const { isAIControlling, setIsAIControlling } = useControlContext();

  return (
    <div className="flex flex-col h-full bg-exam-bg md:p-2 md:gap-2 exam-section">
      <nav className="items-center justify-between hidden px-4 py-3 bg-white md:flex rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-2 text-2xl font-semibold text-primary-500"
            >
              {sectionName}
            </span>
          </div>
        </div>

          <div className="absolute left-[50%] translate-x-[-50%]">
          <ExamControl isAI={isAIControlling} />
          </div>

        <div className="flex justify-end items-center mr-8 gap-4">
          <div className="flex justify-center items-center h-[25px] gap-2 font-satoshi-light pr-4 border-r border-primary-500">
            <span className="font-satoshi">Question ID:</span>
            {questionId}
          </div>
          <div className="flex justify-center items-center h-[25px] gap-2 font-satoshi-light mr-2">
            <span className="font-satoshi">Answer:</span>
            {answer?.toUpperCase()}
          </div>
          <ExitButton isExamOver={isExamOver} isExamReal={isExamReal} />
        </div>

      </nav>
      <section
        className="h-[86vh] md:h-full pt-6 md:pt-0 overflow-auto md:overflow-hidden pb-28 md:pb-0"

      >
        {children}
      </section>

      <ExamNavigation
        isLastQuestion={isLastQuestion}
        isBackButtonDisabled={isBackButtonDisabled}
        totalQuestions={totalQuestions}
        sectionQuestionsStatus={sectionQuestionsStatus}
        questionNumber={questionNumber}
        sections={sections}
        isExamOver={isExamOver}
      >
      </ExamNavigation>
    </div>
  );
}
