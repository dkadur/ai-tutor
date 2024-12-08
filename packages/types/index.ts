import type { Request } from "express";
import type { exams, exam_attempt_questions, questions, sections, users, tags, exam_attempt_sections, exam_attempts } from "@prisma/client";


export type ExamType = 'dsat' | 'psat';
export type AttemptType = 'exam' | 'practice';
export type QuestionType = 'rw' | 'math';
export type AttemptStatus = 'in_progress' | 'completed';
export type AttemptQuestionWithQuestion = exam_attempt_questions & {
  question: questions;
};
export type SectionQuestionStatus = {
  is_answered: boolean;
  question_number: number;
  marked_for_review: boolean;
};
export type CreateUserAction = "next" | "back";

export interface GetSectionScoreArgs {
  attemptId: string;
  sectionId: string;
}

export interface LastAttemptRequest extends Request {
  params: {
    user_id: string;
    practice_attempt_id: string;
    tag_id: string;
    question_number: string;
    question_id: string;
  },
  query: {
    exam_type: ExamType;
    tag_ids: string;
  }
}

export interface LastAttemptResponseData extends exam_attempts {
  sectionName: string;
  examName: string;
}

export interface AttemptRequest extends Request {
  params: {
    attempt_id: string;
  }
}

export interface UserRequest extends Request {
  params: {
    user_id: string;
  }
}

export interface VerifyAttemptRequest extends Request {
  params: {
    attempt_id: string;
    user_id: string;
  }
}

export interface UpdateTimeCompleteSection extends Request {
  params: {
    attempt_section_id: string;
    remaining_time: string;
  },
}

export interface ReviewAttemptRequest extends Request {
  params: {
    attempt_id: string;
  }
}

export interface SaveAttemptScoreRequest extends Request {
  params: {
    attempt_id: string;
  },
  query: {
    exam_type: ExamType;
  }
}

export interface SubmitQuestionRequest extends Request {
  params: {
    attempt_id: string;
    section_id: string;
    question_id: string;
  };
  body: {
    answer: string;
    section_time_left: string;
  };
}

export interface GetQuestionsRequest extends Request {
  params: {
    attempt_id: string;
    section_id: string;
  };
}

export interface ExamAttemptQuestionsResponseData {
  questions: AttemptQuestionWithQuestion[];
  totalQuestions: number;
  totalSections: number;
  section: sections;
  attemptSection: exam_attempt_sections;
  sectionQuestionsStatus: SectionQuestionStatus[];
}

export interface AllExamsRequest extends Request {
  query: {
    exam_type: ExamType;
  }
}

export interface CreateExamAttemptRequest extends Request {
  params: {
    exam_id: string;
    user_id: string;
  }
  body: {
    exam_type: ExamType;
    is_long: string;
  }
}

export interface CreateExamAttemptResponseData {
  attempt_id: number;
  section_id: number;
}

export interface ExamsWithTotalAttempts extends exams {
  totalExamAttempts: number;
  status: string;
  attempt_id: string;
  current_section_id: string;
  current_question_id: string;
}

export interface MarkAsReviewedRequest extends Request {
  params: {
    attempt_id: string;
  }
  body: {
    question_id: string;
  }
}

export interface GenerateNewSectionRequest extends Request {
  params: {
    attempt_id: string;
    section_id: string;
  },
  body: {
    exam_id: string;
    exam_type: ExamType;
  }
};

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

export interface GetAllAttemptsRequest extends Request {
  params: {
    user_id: string;
  },
  query: {
    exam_type: ExamType;
    status: AttemptStatus;
  }
};

export interface GetCurrentExamRequest extends Request {
  params: {
    attempt_id: string;
    exam_id: string;
    section_id: string;
  }
}


export interface GetExamSummaryRequest extends Request {
  params: {
    attempt_id: string;
    exam_id: string;
    user_id: string;
  }
  query: {
    is_public: string;
  }
}

export type Tag = {
  tag_id: number;
  name: string;
  sub_category_id: number;
  exam_type: ExamType | null;
};

export interface DeleteAttemptRequest extends Request {
  params: {
    attempt_id: string;
  }
}