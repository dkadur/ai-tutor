import clsx from "clsx";
import { Bookmark, Navigation2 } from "lucide-react";
import Link from "next/link";

interface SectionQuestionProps {
  sectionQuestionsStatus: {
    is_answered: boolean;
    question_number: number;
    marked_for_review: boolean;
  }[];
  params: { exam_id: string; attempt_id: string; section_id: string; question_number: string };
  isAsTeacher?: boolean;
}

export function SectionQuestions({ sectionQuestionsStatus, params, isAsTeacher }: SectionQuestionProps) {
  const { exam_id, attempt_id, section_id, question_number } = params as { [key: string]: string };
  const currentQuestionNumber = parseInt(question_number);

  return (
    <div className="grid grid-cols-6 gap-2 lg:grid-cols-7">
      {sectionQuestionsStatus &&
        sectionQuestionsStatus.map(({ is_answered, question_number, marked_for_review }) => {
          return (
            <div className="relative" key={question_number}>
              <Link
                href={`/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/question/${question_number}${
                  isAsTeacher ? "?asTeacher=true" : ""
                }`}
                className={clsx(
                  "rounded-full w-11 h-11 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold",
                  is_answered ? "bg-secondary-100 text-secondary-600 hover:bg-secondary-200 font-bold" : "",
                  currentQuestionNumber === question_number ? "bg-secondary-600 !text-white hover:bg-secondary-700" : "",
                )}
              >
                {question_number}

                {marked_for_review && (
                  <Bookmark className="absolute bottom-0 md:right-[50%] md:translate-x-2.5 translate-y-1.5" size={18} fill="red" color="red" />
                )}
              </Link>
            </div>
          );
        })}
    </div>
  );
}
