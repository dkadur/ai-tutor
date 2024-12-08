"use client";
import clsx from "clsx";
import { ChevronUp, Navigation2 } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getQuestionPreviewNavigation } from "@/lib/utils";

export const ExamNavigationPreview = ({
  isLastQuestion,
  isBackButtonDisabled,
  totalQuestions,
  sections,
}: {
  isLastQuestion: boolean,
  isBackButtonDisabled: boolean,
  totalQuestions: number,
  sections: { section_id: number, name: string }[],
}) => {
  const { question_number } = useParams() as { question_number: string };
  const currentQuestionNumber = parseInt(question_number);
  const nextPagePath = getQuestionPreviewNavigation({ isLastQuestion, questionNumber: parseInt(question_number), navigationAction: "next" });
  const backPagePath = getQuestionPreviewNavigation({ isLastQuestion, questionNumber: parseInt(question_number), navigationAction: "back" });

  return (
    <div className="fixed bg-white bottom-6 grid grid-cols-2 md:grid-cols-3 w-full px-6">
      <div />
      <Popover>
        <PopoverTrigger>
          <div className={
            clsx(
              buttonVariants({}),
              "flex justify-center items-center gap-2"
            )
          }>
            <span>Question {question_number} of {totalQuestions}</span>
            <ChevronUp size={22} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 lg:w-96 !cursor-default">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-5 lg:grid-cols-7 gap-4">
              {Array.from({ length: totalQuestions }).map((_, i) => {
                const question_number = i + 1;
                return <div className="relative" key={question_number}>
                  <Link
                    href={`/mock-exam/question/${question_number}`}
                    className={`flex justify-center items-center h-full w-full border-2 rounded cursor-pointer`}
                  >
                    {question_number}
                  </Link>
                  {currentQuestionNumber === question_number && (
                    <Navigation2
                      className="absolute left-1/2 transform -translate-x-1/2"
                      size={13}
                      fill="#F5883F"
                      color="black"
                    />
                  )}
                </div>
              })}
            </div>

            <Separator />

            {sections.length > 0 ? (
              <div className="flex gap-2">
                {
                  sections.map(({ section_id, name }) => (
                    <Link
                      key={section_id}
                      href={`/section/${section_id}/question/1`}
                      // className={`${parseInt(section_id) === section_id ? "bg-customIndigo text-white border-customIndigo hover:bg-customIndigoDark" : "text-black border-gray-500 hover:bg-gray-200"}
                      // flex justify-center items-center h-full w-full rounded border-2 cursor-pointer font-medium`}
                      className={`
                      flex justify-center items-center h-full w-full rounded border-2 cursor-pointer font-medium`}
                    >
                      {name.replace("Reading and Writing", "RW")}
                    </Link>
                  ))
                }
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <Link
                  href={`/mock-exam/summary`}
                  className={`flex justify-center items-center h-full border-2 px-2 rounded-full cursor-pointer border-gray-500 hover:bg-gray-200 font-medium`}
                >
                  Go to end of section
                </Link>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex justify-end gap-2">
        <Button asChild
          className={
            clsx(
              isBackButtonDisabled ? "pointer-events-none bg-gray-400 border border-gray-400 cursor-not-allowed" : "text-customIndigo bg-white border border-customIndigo",
              "font-medium hover:bg-gray-100"
            )}
        >
          <Link href={backPagePath}>
            Back
          </Link>
        </Button>
        <Button asChild
          className="bg-customIndigo hover:bg-customIndigoDark"
        >
          <Link href={nextPagePath}>
            Next
          </Link>
        </Button>
      </div>
    </div>
  );
};