import { ClassValue, clsx } from 'clsx';
import { evaluate } from 'mathjs';
import { twMerge } from 'tailwind-merge';

import { ExamType } from '@wolfietutor/types';
import { Roles } from '@/types/globals';

export const EXAM_TYPES: ExamType[] = ['dsat', 'psat'];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const getQuestionNavigation = ({
  isLastQuestion,
  params,
  navigationAction,
  questionNumberSelected,
}: {
  isLastQuestion: boolean;
  params: {
    exam_id: string;
    attempt_id: string;
    section_id: string;
    question_number: string;
  };
  navigationAction: "back" | "next" | "popover";
  questionNumberSelected?: number;
}) => {
  const { exam_id, attempt_id, section_id, question_number } = params;
  const questionNumber = parseInt(question_number);

  if (navigationAction === "popover") {
    return `/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/question/${questionNumberSelected}`;
  }

  if (navigationAction === "next" && isLastQuestion) {
    return `/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/end`;
  }

  return `/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/question/${navigationAction === "back" ? questionNumber - 1 : questionNumber + 1}`;
};

export const getQuestionPreviewNavigation = ({
  isLastQuestion,
  questionNumber,
  navigationAction,
  questionNumberSelected,
}: {
  isLastQuestion: boolean;
  questionNumber: number;
  navigationAction: "back" | "next" | "popover";
  questionNumberSelected?: number;
}) => {
  if (navigationAction === "popover") {
    return `/mock-exam/question/${questionNumberSelected}`;
  }

  if (navigationAction === "next" && isLastQuestion) {
    return `/mock-exam/summary`;
  }

  return `/mock-exam/question/${navigationAction === "back" ? questionNumber - 1 : questionNumber + 1}`;
};

export const isAllowed = (roles: Roles[] | Roles) => {
  return true;
};

export const sanitizeAnswer = (input: string) => {
  return input
    .trim()
    .toLowerCase()
    .replaceAll("`", "")
    .replace(/^(\$\$|\$)/, "")
    .replace(/(\$\$|\$)$/, "");
};

export const isCorrectAnswer = (userAnswer: string, correctAnswer: string) => {
  const availableAnswers = ["a", "b", "c", "d"];
  const userAnswerSanitized = sanitizeAnswer(userAnswer);
  const correctAnswerSanitized = sanitizeAnswer(correctAnswer!);
  const isFreeResponse = !availableAnswers.includes(correctAnswerSanitized);
  const isCorrect = isFreeResponse
    ? correctAnswerSanitized === userAnswerSanitized ||
    // If user's math free response answer is within 0.001 then answer is considered correct.
    Math.abs(evaluate(correctAnswerSanitized) - evaluate(userAnswerSanitized)) <= 0.001
    : correctAnswerSanitized === userAnswerSanitized;

  return isCorrect;
};

export const isMac = () => {
  if (typeof window !== 'undefined') {
    return navigator.platform.indexOf('Mac') > -1;
  }
  return false;
};

export const preprocessLaTeX = (content: string) => {
  // Replace block-level LaTeX delimiters \[ \] with $$ $$

  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`,
  );
  // Replace inline LaTeX delimiters \( \) with $ $
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`,
  );
  return inlineProcessedContent;
};

export const isLatex = (content: string) => {
  if (content === null || content === undefined) return false;
  return content.includes("`$") || content.includes("$`") || content.includes("`$$") || content.includes("$$`") || content.includes("`\\") || content.includes("\\`") || content.includes("`\\(") || content.includes("\\)`") || content.includes("`\\[") || content.includes("\\]`") || content.includes("`\\[") || content.includes("\\]`");
};

export const escapeDollars = (inputString: string) => {
  if (inputString === null || inputString === undefined) return "";
  return inputString.replace(/(?<!\$)(?<!`)\$(?=\d+)/g, '\\$');
};

export const shortNameToLongName = (shortName: string) => {
  switch (shortName) {
    case "rw":
      return "Reading & Writing";
    case "math":
      return "Math";
    default:
      return shortName;
  }
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
};

export function debounce<T extends (...args: any[]) => Promise<any>>(func: T, delay: number = 300): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    return new Promise<ReturnType<T>>((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, delay);
    });
  };
}

export
  const SHORTCUTS = {
    "start-exam": {
      keyset: "ctrl + shift + 1, ctrl + alt + 1",
      keycommand: "Start new exam",
      keycombination: isMac() ? "^⇧1" : "Ctrl⇧1",
      actionUrl: "/start-exam"
    },
    "continue-last-exam": {
      keyset: "ctrl + shift + k, ctrl + alt + k",
      keycommand: "Continue last exam",
      keycombination: isMac() ? "^⇧K" : "Ctrl+Alt+K",
    },
    "current-exams": {
      keyset: "ctrl + shift + e, ctrl + alt + e",
      keycommand: "Current exams",
      keycombination: isMac() ? "^⇧E" : "Ctrl+Alt+E",
      actionUrl: "/attempt/current"
    },
    "past-exams": {
      keyset: "ctrl + shift + p, ctrl + alt + p",
      keycommand: "Past exams",
      keycombination: isMac() ? "^⇧P" : "Ctrl+Alt+P",
      actionUrl: "/attempt/past"
    },
    "practice-by-topic": {
      keyset: "ctrl + shift + y, ctrl + alt + y",
      keycommand: "Practice by topic",
      keycombination: isMac() ? "^⇧Y" : "Ctrl+Alt+Y",
      actionUrl: "/practice/topic"
    },
    "missed-and-flagged": {
      keyset: "ctrl + shift + f, ctrl + alt + f",
      keycommand: "Missed and flagged",
      keycombination: isMac() ? "^⇧F" : "Ctrl+Alt+F",
      actionUrl: "/practice/missed-and-flagged"
    },
    "practice-history": {
      keyset: "ctrl + shift + h, ctrl + alt + h",
      keycommand: "Practice history",
      keycombination: isMac() ? "^⇧H" : "Ctrl+Alt+H",
      actionUrl: "/practice/history"
    },
    "home": {
      keyset: "ctrl + shift + /, ctrl + alt + /",
      keycommand: "Home",
      keycombination: isMac() ? "^⇧/" : "Ctrl+Alt+/",
      actionUrl: "/dashboard"
    }
  }

export function getRankString(number: number): string {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${number}th`;
  }

  switch (lastDigit) {
    case 1:
      return `${number}st`;
    case 2:
      return `${number}nd`;
    case 3:
      return `${number}rd`;
    default:
      return `${number}th`;
  }
}

export const examTypeMap: Record<ExamType, string> = {
  dsat: "Digital SAT",
  psat: "Preliminary SAT",
};

export const isGC = (publicMetadata: any) => {
  return publicMetadata?.role && publicMetadata?.role.length === 1 && publicMetadata?.role?.includes("gc")
};


export const MAX_YEAR = new Date(new Date().getFullYear() + 10, 11, 31);

export function getExcludedMonths(examType: ExamType) {
  const startYear = new Date().getFullYear();
  const endYear = startYear + 10;
  const excludedMonths = examType === "dsat" ? [0, 1, 3, 6, 8] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11];
  const result: Date[] = [];

  for (let year = startYear; year <= endYear; year++) {
    excludedMonths.forEach(month => {
      result.push(new Date(year, month));
    });
  }

  return result;
}

export function getFirstAvailableDate(examType: ExamType) {
  const startYear = new Date().getFullYear();
  const excludedMonths = examType === "dsat" ? [0, 1, 3, 6, 8] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11];
  const now = new Date();

  for (let year = startYear; year <= startYear + 10; year++) {
    for (let month of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
      const date = new Date(year, month);

      if (date > now && !excludedMonths.includes(month)) {
        return date; // Return the first available date that is in the future
      }
    }
  }

  return null;
}

export const extractPaginationFromSearchParams = (searchParams: Record<string, string | undefined>, id: string) => {
  const page = searchParams[`${id}page`];
  const size = searchParams[`${id}size`];

  // Handle pagination
  const pageInt = page ? parseInt(page) : 0;
  const pageSizeInt = size ? parseInt(size) : 10;

  const skip = pageInt * pageSizeInt;
  const take = pageSizeInt;

  // Extract filter parameters specific to this table
  const filterParams = Object.keys(searchParams).reduce((acc, key) => {
    if (key.startsWith(`${id}filter_`)) {
      acc[key] = searchParams[key] ?? "";
    }
    return acc;
  }, {} as Record<string, string>);

  // Build the where clause based on the filter parameters
  const where = Object.entries(filterParams).reduce((acc, [key, value]) => {
    const field = key.replace(`${id}filter_`, ''); // Remove the id-specific prefix from filter keys
    return {
      ...acc,
      [field]: {
        contains: value,
        mode: 'insensitive', // Case-insensitive search
      },
    };
  }, {});

  return { skip, take, where, page: pageInt, size: pageSizeInt };
}