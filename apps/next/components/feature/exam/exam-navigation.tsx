"use client";
import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getQuestionNavigation } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { SectionQuestions } from "../../ui/section-questions";

export const ExamNavigation = ({
  isLastQuestion,
  isBackButtonDisabled,
  totalQuestions,
  sectionQuestionsStatus,
  sections,
  isExamOver,
  questionNumber,
}: {
  isLastQuestion: boolean;
  isBackButtonDisabled: boolean;
  totalQuestions: number;
  sectionQuestionsStatus: { is_answered: boolean; question_number: number; marked_for_review: boolean }[];
  sections: { section_id: number; name: string }[];
  isExamOver: boolean;
  questionNumber: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams() as { exam_id: string; attempt_id: string; section_id: string; question_number: string };
  const { exam_id, attempt_id, section_id, question_number } = params;
  const nextPagePath = getQuestionNavigation({ isLastQuestion, params, navigationAction: "next" });
  const backPagePath = getQuestionNavigation({ isLastQuestion, params, navigationAction: "back" });

  return (
    <div className={`sticky bottom-0 flex flex-col w-full gap-2 md:relative md:flex-row md:justify-between md:items-center`}>
      <Popover>
        <PopoverTrigger asChild className="hidden md:flex absolute left-[50%] translate-x-[-50%]">
          <Button variant="full" className="rounded-full">
            Question {questionNumber} of {totalQuestions}
            <ChevronUp size={18} className="ml-2 text-primary-200" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit max-w-[550px] bg-white flex flex-col gap-4 rounded-lg" sideOffset={20}>
          <SectionQuestions sectionQuestionsStatus={sectionQuestionsStatus} params={params} />
          {isExamOver ? (
            <div className="flex gap-2">
              {sections.map(({ section_id, name }) => (
                <Link
                  key={section_id}
                  href={`/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/question/1`}
                  className={`${parseInt(params.section_id) === section_id
                    ? "bg-customIndigo text-white border-customIndigo hover:bg-customIndigoDark"
                    : "text-black border-gray-500 hover:bg-gray-200"
                    }
                      flex justify-center items-center h-full w-full rounded border-2 cursor-pointer font-medium`}
                >
                  {name.replace("Reading and Writing", "RW")}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Button variant="secondary" className="w-full" asChild>
                <Link href={`/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/end`}>Go to end of section</Link>
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <div className="flex justify-end w-full">
        <div className="items-center gap-2 md:flex">
          <Button
            asChild
            variant="secondary"
            disabled={isBackButtonDisabled}
            className="font-medium w-36 bg-secondary-200 text-secondary-500 hover:bg-gray-100"
          >
            {isBackButtonDisabled ? "Back" : <Link href={backPagePath}>Back</Link>}
          </Button>
          <Button asChild className="w-36">
            <Link href={nextPagePath}>Next</Link>
          </Button>
        </div>
      </div>

        <div className="flex items-center gap-2 p-4 bg-white shadow-t-sm md:hidden">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger>
              <Button className="flex items-center justify-center rounded-full md:hidden w-11 h-11" variant="full">
                {isOpen ? <ChevronDown size={18} /> : question_number}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="flex flex-col gap-6 px-8 pt-4 pb-8">
                <p className="text-xl text-center">
                  Question {question_number} of {totalQuestions}
                </p>
                <SectionQuestions sectionQuestionsStatus={sectionQuestionsStatus} params={params} />

                {isExamOver ? (
                  <div className="flex gap-2">
                    {sections.map(({ section_id, name }) => (
                      <Link
                        key={section_id}
                        href={`/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/question/1`}
                        className={`${parseInt(params.section_id) === section_id
                          ? "bg-customIndigo text-white border-customIndigo hover:bg-customIndigoDark"
                          : "text-black border-gray-500 hover:bg-gray-200"
                          }
                      flex justify-center items-center h-full w-full rounded border-2 cursor-pointer font-medium`}
                      >
                        {name.replace("Reading and Writing", "RW")}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="secondary" className="w-full" asChild>
                      <Link href={`/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/end`}>Go to end of section</Link>
                    </Button>
                  </div>
                )}
              </div>
            </DrawerContent>
          </Drawer>
          <Button
            asChild
            variant="secondary"
            disabled={isBackButtonDisabled}
            className="w-full font-medium bg-secondary-200 text-secondary-500 hover:bg-gray-100"
          >
            {isBackButtonDisabled ? "Back" : <Link href={backPagePath}>Back</Link>}
          </Button>
          <Button asChild className="w-full">
            <Link href={nextPagePath}>Next</Link>
          </Button>
        </div>
    </div>
  );
};
