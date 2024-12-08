-- CreateEnum
CREATE TYPE "sections_difficulty_level" AS ENUM ('easy', 'hard');

-- CreateEnum
CREATE TYPE "sections_type" AS ENUM ('rw', 'math');

-- CreateEnum
CREATE TYPE "exam_type" AS ENUM ('dsat', 'psat');

-- CreateTable
CREATE TABLE "questions" (
    "question_id" SERIAL NOT NULL,
    "section_id" INTEGER,
    "text" TEXT NOT NULL,
    "choice_a" TEXT,
    "choice_b" TEXT,
    "choice_c" TEXT,
    "choice_d" TEXT,
    "difficulty_level" INTEGER NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "exam_id" INTEGER,
    "category_id" INTEGER NOT NULL,
    "sub_category_id" INTEGER NOT NULL,
    "remarks" TEXT,
    "passage" TEXT,
    "question_order" INTEGER,
    "choice_a_image" TEXT,
    "choice_b_image" TEXT,
    "choice_c_image" TEXT,
    "choice_d_image" TEXT,
    "correct_answer_image" TEXT,
    "previous_question_id" INTEGER,
    "is_archived" BOOLEAN DEFAULT false,
    "exam_type" "exam_type" DEFAULT 'dsat',

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "exam_type" "exam_type" DEFAULT 'dsat',
    "fullName" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "sub_categories" (
    "sub_category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "exam_type" "exam_type" DEFAULT 'dsat',

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("sub_category_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "tag_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sub_category_id" INTEGER NOT NULL,
    "exam_type" "exam_type" DEFAULT 'dsat',

    CONSTRAINT "tags_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "question_tags" (
    "question_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "question_tags_pkey" PRIMARY KEY ("question_id","tag_id")
);

-- CreateTable
CREATE TABLE "exams" (
    "exam_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "exam_type" "exam_type" NOT NULL DEFAULT 'dsat',

    CONSTRAINT "exams_pkey" PRIMARY KEY ("exam_id")
);

-- CreateTable
CREATE TABLE "exam_config" (
    "config_id" SERIAL NOT NULL,
    "exam_type" "exam_type" NOT NULL DEFAULT 'dsat',
    "config" JSONB NOT NULL,

    CONSTRAINT "exam_config_pkey" PRIMARY KEY ("config_id")
);

-- CreateTable
CREATE TABLE "exam_attempts" (
    "attempt_id" SERIAL NOT NULL,
    "user_id" VARCHAR(80) NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "start_time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMPTZ(6),
    "status" VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    "current_section_id" INTEGER,
    "current_question_id" INTEGER,
    "is_real" BOOLEAN NOT NULL DEFAULT true,
    "math_score" INTEGER,
    "reading_writing_score" INTEGER,
    "total_score" INTEGER,
    "is_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "is_long" BOOLEAN NOT NULL DEFAULT false,
    "exclude_from_analytics" BOOLEAN NOT NULL DEFAULT false,
    "scores" TEXT,

    CONSTRAINT "exam_attempts_pkey" PRIMARY KEY ("attempt_id")
);

-- CreateTable
CREATE TABLE "exam_attempt_sections" (
    "attempt_section_id" SERIAL NOT NULL,
    "attempt_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "current_section_time_left" INTEGER,
    "total_questions" INTEGER,
    "section_order" INTEGER,
    "time_left_on_complete" INTEGER,

    CONSTRAINT "exam_attempt_sections_pkey" PRIMARY KEY ("attempt_section_id")
);

-- CreateTable
CREATE TABLE "exam_attempt_questions" (
    "attempt_question_id" SERIAL NOT NULL,
    "attempt_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "is_answered" BOOLEAN NOT NULL DEFAULT false,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "user_answer" VARCHAR(80),
    "marked_for_review" BOOLEAN NOT NULL DEFAULT false,
    "section_id" INTEGER NOT NULL,
    "question_number" INTEGER NOT NULL,
    "time_stamp" INTEGER,

    CONSTRAINT "exam_attempt_questions_pkey" PRIMARY KEY ("attempt_question_id")
);

-- CreateTable
CREATE TABLE "sections" (
    "section_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "time_limit" INTEGER,
    "difficulty_level" "sections_difficulty_level" NOT NULL DEFAULT 'easy',
    "type" "sections_type" NOT NULL DEFAULT 'rw',
    "exam_type" "exam_type" NOT NULL DEFAULT 'dsat',
    "total_questions" INTEGER,
    "section_order" INTEGER,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "practice_attempts" (
    "attempt_id" SERIAL NOT NULL,
    "user_id" VARCHAR(80) NOT NULL,
    "start_time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMPTZ(6),
    "status" VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    "score" INTEGER,
    "exam_type" "exam_type" DEFAULT 'dsat',
    "exclude_from_analytics" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "practice_attempts_pkey" PRIMARY KEY ("attempt_id")
);

-- CreateTable
CREATE TABLE "practice_attempt_tags" (
    "practice_attempt_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "tag_order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "practice_attempt_tags_pkey" PRIMARY KEY ("practice_attempt_id","tag_id")
);

-- CreateTable
CREATE TABLE "practice_attempt_questions" (
    "question_id" INTEGER NOT NULL,
    "is_answered" BOOLEAN DEFAULT false,
    "is_correct" BOOLEAN DEFAULT false,
    "user_answer" CHAR(80),
    "marked_for_review" BOOLEAN DEFAULT false,
    "practice_attempt_id" INTEGER NOT NULL,
    "practice_attempt_question_id" SERIAL NOT NULL,
    "question_number" INTEGER NOT NULL,
    "tag_id" INTEGER,

    CONSTRAINT "practice_attempt_questions_pkey" PRIMARY KEY ("practice_attempt_question_id")
);

-- CreateTable
CREATE TABLE "missed_and_flagged_questions" (
    "m_f_question_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "exam_type" "exam_type" DEFAULT 'dsat',

    CONSTRAINT "missed_and_flagged_questions_pkey" PRIMARY KEY ("m_f_question_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(80) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "name" VARCHAR(50),
    "registration_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "dream_school" VARCHAR(150),
    "have_taken_ACT" BOOLEAN DEFAULT false,
    "have_taken_SAT" BOOLEAN DEFAULT false,
    "is_onboarded" BOOLEAN DEFAULT false,
    "math_courses_taken" TEXT[],
    "parent_email" VARCHAR(100),
    "parent_phone_number" VARCHAR(30),
    "previous_ACT_score" INTEGER,
    "previous_SAT_RW_score" INTEGER,
    "previous_SAT_math_score" INTEGER,
    "target_exam" "exam_type",
    "target_exam_date" TIMESTAMP(3),
    "state_of_residence" VARCHAR(20),
    "student_grade" INTEGER,
    "student_phone_number" VARCHAR(30),
    "target_sat_score" INTEGER,
    "target_psat_score" INTEGER,
    "target_school" TEXT[],
    "date_of_birth" TIMESTAMP(3),
    "parent_firstName" VARCHAR(50),
    "parent_lastName" VARCHAR(50),
    "surname" VARCHAR(100),
    "grade_school" VARCHAR(150),
    "school_id" INTEGER,
    "country" VARCHAR(100),
    "guidance_counselor_email" VARCHAR(100),
    "can_contact_parent" BOOLEAN DEFAULT true,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "questions_category_id_idx" ON "questions"("category_id");

-- CreateIndex
CREATE INDEX "questions_sub_category_id_idx" ON "questions"("sub_category_id");

-- CreateIndex
CREATE INDEX "question_tags_question_id_tag_id_idx" ON "question_tags"("question_id", "tag_id");

-- CreateIndex
CREATE INDEX "exam_attempts_user_id_idx" ON "exam_attempts"("user_id");

-- CreateIndex
CREATE INDEX "exam_attempts_status_idx" ON "exam_attempts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "practice_attempt_tags_practice_attempt_id_tag_id_key" ON "practice_attempt_tags"("practice_attempt_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "missed_and_flagged_questions_user_id_question_id_exam_id_key" ON "missed_and_flagged_questions"("user_id", "question_id", "exam_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("exam_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("section_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("sub_category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("sub_category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "question_tags" ADD CONSTRAINT "question_tags_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "question_tags" ADD CONSTRAINT "question_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("exam_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_attempt_sections" ADD CONSTRAINT "exam_attempt_sections_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "exam_attempts"("attempt_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_attempt_sections" ADD CONSTRAINT "exam_attempt_sections_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("section_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_attempt_questions" ADD CONSTRAINT "exam_attempt_questions_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "exam_attempts"("attempt_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_attempt_questions" ADD CONSTRAINT "exam_attempt_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_attempt_questions" ADD CONSTRAINT "exam_attempt_questions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_attempts" ADD CONSTRAINT "practice_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "practice_attempt_tags" ADD CONSTRAINT "practice_attempt_tags_practice_attempt_id_fkey" FOREIGN KEY ("practice_attempt_id") REFERENCES "practice_attempts"("attempt_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "practice_attempt_tags" ADD CONSTRAINT "practice_attempt_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "practice_attempt_questions" ADD CONSTRAINT "practice_attempt_questions_practice_attempt_id_fkey" FOREIGN KEY ("practice_attempt_id") REFERENCES "practice_attempts"("attempt_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "practice_attempt_questions" ADD CONSTRAINT "practice_attempt_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "missed_and_flagged_questions" ADD CONSTRAINT "missed_and_flagged_questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("exam_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "missed_and_flagged_questions" ADD CONSTRAINT "missed_and_flagged_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "missed_and_flagged_questions" ADD CONSTRAINT "missed_and_flagged_questions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
