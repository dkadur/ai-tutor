"use client";

import "katex/dist/katex.min.css";
import "@/components/ui/elimination.css";

import Image from "next/image";
import { ControllerRenderProps } from "react-hook-form";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";

import { Input } from "@/components/ui/input";

import { FormControl, FormLabel } from "../ui/form";

interface AnswerSelectProps {
  choice: {
    text: string;
    value: string | null | undefined;
    image?: string | null;
    isEliminated?: boolean;
  };
  userAnswer?: string | null;
  field: ControllerRenderProps<
    {
      answer: string;
    },
    "answer"
  >;
  isExamOver: boolean;
  correctAnswer?: string;
  isEliminated: boolean;
  showCorrectAnswer: boolean;
}

export default function AnswerSelect({ choice, userAnswer, field, isExamOver, correctAnswer, showCorrectAnswer, isEliminated }: AnswerSelectProps) {
  const wrongUserAnswer =
    isExamOver && choice.text.toLowerCase() === userAnswer?.toLowerCase() && choice.text.toLowerCase() !== correctAnswer?.toLowerCase();
  const isChecked = userAnswer === choice.text;
  const allowToShowCorrectAnswer = showCorrectAnswer && choice.text.toLowerCase() === correctAnswer?.toLowerCase();

  return (
    <li className={`w-full ${isEliminated ? "eliminated-choice pointer-events-none" : ""}`}>
      <FormControl>
        <Input
          {...field}
          type="radio"
          disabled={isExamOver}
          id={choice.text}
          name="answer"
          checked={isChecked}
          value={choice.text}
          className="hidden"
        />
      </FormControl>
      <FormLabel
        htmlFor={choice.text}
        className={`flex items-center gap-4 w-full px-3 py-2.5 text-md
          text-gray-900 bg-white border border-gray-100 rounded-2xl
          cursor-pointer ${isChecked && "border-primary-600 !text-white !bg-primary-500"} 
          hover:border-primary-200
          ${isExamOver ? "cursor-not-allowed hover:bg-gray-100 hover:border-transparent" : ""}
          ${wrongUserAnswer ? "border-red-500 [&>span]:bg-red-500 [&>span]:text-white" : ""}
          ${allowToShowCorrectAnswer ? "!border-secondary-500 ![&>span]:bg-secondary-500 ![&>span]:text-white" : ""}
          ${isEliminated ? "bg-white border border-gray-100 hover:bg-white text-gray-300 [&>span]:text-gray-300 [&>span]:bg-gray-50" : ""}
        `}
      >
        <span className={`bg-primary-50 rounded-full px-2.5 w-11 h-10 flex items-center justify-center text-primary-800 font-bold`}>
          {choice.text}
        </span>
        <Markdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          className={`${isEliminated ? "text-gray-300" : ""} w-full leading-6`}
        >
          {choice.value?.replaceAll("`", "")}
        </Markdown>
      </FormLabel>
    </li>
  );
}
