"use client";

import 'katex/dist/katex.min.css';
import '@/components/ui/elimination.css';

import { ControllerRenderProps } from 'react-hook-form';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';

import { Input } from '@/components/ui/input';

import { FormControl, FormLabel } from '../../ui/form';

interface AnswerSelectProps {
  choice: {
    text: string,
    value: string,
  };
  userAnswer?: string | null;
  field: ControllerRenderProps<{
    answer: string;
  }, "answer">
  isEliminated: boolean;
  showCorrectAnswer?: boolean;
  correctAnswer?: string;
}

export default function AnswerSelectPreview({ choice, userAnswer, field, isEliminated, showCorrectAnswer, correctAnswer }: AnswerSelectProps) {
  const isChecked = userAnswer === choice.text;

  return (
    <li className={`w-full ${isEliminated ? 'eliminated-choice pointer-events-none' : ''}`}>
      <FormControl>
        <Input
          {...field}
          type="radio"
          id={choice.text}
          name="answer"
          checked={isChecked}
          value={choice.text}
          className="hidden peer"
        />
      </FormControl>
      <FormLabel
        htmlFor={choice.text}
        className={`flex items-center gap-4 w-full p-5
          text-black bg-white border border-gray-300 rounded-lg
          cursor-pointer ${isChecked && 'border-blue-600 text-blue-600 [&>span]:bg-customIndigo [&>span]:text-white'} 
          hover:text-gray-600 hover:bg-gray-100
          ${showCorrectAnswer && choice.text.toLowerCase() === correctAnswer?.toLowerCase() ? "bg-yellow-500" : ""}
          ${isEliminated ? "bg-white border border-gray-100 hover:bg-white text-gray-300" : ""}
          `}
      >
        <span className={`text-sm font-semibold  rounded-full border-2 px-3 py-1.5 text-center`}>
          {choice.text}
        </span>
        <Markdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          className={`${isEliminated ? "text-gray-300" : ""} md:text-lg w-full leading-6`}
        >
          {choice.value?.replaceAll("`", "")}
        </Markdown>
      </FormLabel>
    </li>
  );
}