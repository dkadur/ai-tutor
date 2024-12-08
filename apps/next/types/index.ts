import { useToast } from '@/components/ui/use-toast';

import { exam_attempts, questions, users } from '@prisma/client';
import { Roles } from './globals';
import { ExamType } from '@wolfietutor/types';

export const adminUserId = "admin";

export interface TestCard {
  title: string;
  description: string;
  to: string;
}

export interface ExamAttempt {
  attempt_id: number;
  user_id: string;
  exam_id: number;
  start_time: Date;
  end_time: Date | null;
  status: string;
  current_section_id: number | null;
  current_question_id: number | null;
}

export interface AttemptTableRow extends ExamAttempt {
  sectionName: string | undefined;
  examName: string | undefined;
  total_score: number | null;
  reading_writing_score: number | null;
  math_score: number | null;
  is_real: boolean;
  to: string;
}

export interface AttemptTab extends ExamAttempt {
  sectionName: string | undefined;
  examName: string | undefined;
  to: string;
}

export interface AttemptCard extends ExamAttempt {
  examName: string | undefined;
  sectionName: string | undefined;
  to: string;
}

export interface Route {
  label: string;
  href: string;
  icon?: string;
  children?: Route[];
  component?: React.ReactNode;
}

export interface Section {
  [key: number]: {
    name: string,
    questions: questions[]
  }
}

export type QuestionWithQuestionTags = questions & {
  question_tags: number[]
  type: string | undefined
  answerType: string | undefined
}

export type QuestionType = "rw" | "math";

export interface ExamConfig {
  config_id: number,
  exam_type: ExamType,
  config: {
    total_sections: number,
    sections: {
      name: string,
      type: QuestionType,
      order: number,
      difficulty: "easy" | "hard",
      total_questions: number,
      correct_count?: number,
    }[],
    types: QuestionType[],
    score_mapping: Record<QuestionType, Record<number, number>>
  }
}

export type Filter = {
  name: string;
  accessorKey: string;
}