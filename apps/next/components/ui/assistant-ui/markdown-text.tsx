// markdown-text.tsx

import {
  MarkdownTextPrimitive,
} from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { memo, useEffect, useState, useCallback, useRef, useMemo } from "react";
import 'katex/dist/katex.min.css';
import rehypeRaw from "rehype-raw";
import { useContentPartText } from "@assistant-ui/react";
import Markdown from "react-markdown";
import { escapeDollars } from "@/lib/utils";
import { questions } from "@prisma/client";

interface MarkdownTextProps {
  prompt: string;
  part: { text: string };
  status: { type: string };
  setActionChoice: ({ action, choice }: { action: string, choice: string }) => void;
  choicesHandled: string[];
  handleChoices: (choice: string) => void;
  activeQuestion?: questions | string;
  setActiveQuestion: React.Dispatch<React.SetStateAction<questions | string | undefined>>;
}

const MarkdownTextImpl = ({ prompt, part, status, setActionChoice, choicesHandled, handleChoices, activeQuestion, setActiveQuestion }: MarkdownTextProps) => {
  const { text } = part;
  const { type } = status;

  const [isRunning, setIsRunning] = useState(false);

  // Define the parseQuestion function
  const parseQuestion = (inputText: string): Omit<questions, 'exam_attempt_questions' | 'missed_and_flagged_questions' | 'practice_attempt_questions' | 'question_tags'> => {
    // Initialize variables
    let questionText = '';
    let passage = '';
    let choice_a = '';
    let choice_b = '';
    let choice_c = '';
    let choice_d = '';
  
    // Split the inputText by lines
    const lines = inputText.split('\n');
  
    // Remove any empty lines
    const nonEmptyLines = lines.filter(line => line.trim() !== '');
  
    // Find the indices of choices A-D
    const choiceAIndex = nonEmptyLines.findIndex(line => line.startsWith('A:'));
    const choiceBIndex = nonEmptyLines.findIndex(line => line.startsWith('B:'));
    const choiceCIndex = nonEmptyLines.findIndex(line => line.startsWith('C:'));
    const choiceDIndex = nonEmptyLines.findIndex(line => line.startsWith('D:'));
  
    // The question text is everything before choice A
    const questionLines = nonEmptyLines.slice(0, choiceAIndex);
    questionText = questionLines.join('\n').trim();
  
    // Get the choices
    if (choiceAIndex !== -1) {
      choice_a = nonEmptyLines[choiceAIndex].substring(2).trim();
    }
    if (choiceBIndex !== -1) {
      choice_b = nonEmptyLines[choiceBIndex].substring(2).trim();
    }
    if (choiceCIndex !== -1) {
      choice_c = nonEmptyLines[choiceCIndex].substring(2).trim();
    }
    if (choiceDIndex !== -1) {
      choice_d = nonEmptyLines[choiceDIndex].substring(2).trim();
    }
  
    // Create the question object
    const questionData: Omit<questions, 'exam_attempt_questions' | 'missed_and_flagged_questions' | 'practice_attempt_questions' | 'question_tags'> = {
      question_id: 0, // Autoincrement in database
      section_id: null, // No section provided
      text: questionText,
      choice_a: choice_a || null,
      choice_b: choice_b || null,
      choice_c: choice_c || null,
      choice_d: choice_d || null,
      difficulty_level: 1, // Placeholder difficulty level
      correct_answer: '', // To be set appropriately
      exam_id: null, // No exam specified
      category_id: 1, // Default category, update as needed
      sub_category_id: 1, // Default sub-category, update as needed
      remarks: null,
      passage: passage || null,
      question_order: null, // No order provided
      choice_a_image: null,
      choice_b_image: null,
      choice_c_image: null,
      choice_d_image: null,
      correct_answer_image: null,
      previous_question_id: null,
      is_archived: false,
      exam_type: null,
    };
  
    return questionData;
  };
  

  // Memoize the transform function
  const transformContent = useCallback((inputText: string, currentType: string) => {

    setIsRunning(currentType === 'running');

    if (prompt === "walkthrough" && setActionChoice) {
      // Updated regex to include TRANSFER without a choice
      const regex = /(CROSSOUT|SELECT|TRANSFER)[^A-D]*([A-D])?/g;

      const result = inputText.replace(regex, (_, action, choice) => {
        if (action === "TRANSFER" && currentType === "complete" && isRunning) {
          setActionChoice({ action: "TRANSFER", choice: "" });
        } else if (choice && !choicesHandled.includes(choice)) {
          setActionChoice({ action, choice });
          handleChoices(choice);
        }

        return ''; // Remove the processed action from inputText
      });

      return result;
    } else if (prompt === "similarQuestion" && currentType === "complete" && isRunning) {
      const questionData = parseQuestion(inputText);

      console.log(questionData)
      if (questionData.choice_a) {
        setActiveQuestion(questionData);
      }
    }
    return inputText;
  }, [prompt, setActionChoice, isRunning, setIsRunning, choicesHandled, handleChoices]);

  // Memoize the transformed content
  const transformedContent = useMemo(() => transformContent(text, type), [text, type, transformContent]);

  return (
    <Markdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
    >
      {transformedContent}
    </Markdown>
  );
};

export const MarkdownText = memo(MarkdownTextImpl);

// Keep the clipboard hook as is since it's not related to the performance issue
const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};
