import prisma from '@/lib/prisma';
import { getSectionScore } from '../section/getSectionScore';
import { verifyExamAttempt } from './verifyExamAttempt';

export const getExamSummary = async (exam_id: string, attemptId: string, isPublic = false) => {
  "use server";

  if (!isPublic) {
    await verifyExamAttempt(attemptId);
  }

  const exam = await prisma.exams.findFirst({
    where: {
      exam_id: parseInt(exam_id),
    }
  });

  const examName = exam?.name;

  const attempt = await prisma.exam_attempts.findFirst({
    where: {
      attempt_id: parseInt(attemptId),
    },
    include: {
      exam_attempt_questions: true,
    },
  });

  const startTime = attempt?.start_time;
  const endTime = attempt?.end_time;
  const userID = attempt?.user_id;

  const user = await prisma.users.findFirst({
    where: {
      user_id: userID
    },
    select: {
      name: true,
      surname: true
    }
  });

  const username = user?.name + " " + (!!user?.surname ? user?.surname : ""); 

  const status = attempt?.status;

  const sections = await prisma.sections.findMany();

  const sectionsWithQuestions = sections.map(section => {
    const questions = attempt?.exam_attempt_questions.filter(question => question.section_id === section.section_id);

    return {
      ...section,
      questions,
    };
  });

  const scorePromises = sections.map(async section => {
    const score = await getSectionScore({ attemptId: attemptId, sectionId: section.section_id.toString() });
    return {
      ...section,
      sectionScore: score.score
    };
  });
  const sectionScores = await Promise.all(scorePromises);

  const examAttemptQuestionsForReview = await prisma.exam_attempt_questions.findMany({
    where: {
      attempt_id: parseInt(attemptId),
      marked_for_review: true
    }
  });

  const questionPromises = examAttemptQuestionsForReview.map(async examAttemptQuestion => {
    const question = await prisma.questions.findUnique({
      where: {
        question_id: examAttemptQuestion.question_id
      }
    });
    return question;
  });
  const questionsForReview = await Promise.all(questionPromises);

  const totalQuestions = sectionsWithQuestions.reduce((acc, section) => {
    return acc + section.questions!.length;
  }, 0);

  const answeredQuestions = sectionsWithQuestions.reduce((acc, section) => {
    return acc + section.questions!.filter(question => question.is_answered).length;
  }, 0);

  const correctQuestions = sectionsWithQuestions.reduce((acc, section) => {
    return acc + section.questions!.filter(question => question.is_correct).length;
  }, 0);

  const score = (correctQuestions / totalQuestions) * 100;
  const scores = JSON.parse(attempt?.scores as string);
  const totalScore = attempt?.total_score;

  // TODO: THis is for when we have enough data to calculate the best percent
  // const totalExamsSameType = await prisma.exam_attempts.count({
  //   where: {
  //     status: "completed",
  //     exam_id: Number(exam_id),
  //     is_real: attempt?.is_real,
  //   },
  // });

  // const scoreWorseSameType = await prisma.exam_attempts.count({
  //   where: {
  //     status: "completed",
  //     exam_id: parseInt(exam_id),
  //     is_real: attempt?.is_real,
  //     total_score: {
  //       lt: attempt?.total_score!,
  //     },
  //   },
  // });

  // const percentBetterSameType = (scoreWorseSameType / totalExamsSameType) * 100;
  // const bestPercent = percentBetterSameType < 5 ? 5 : percentBetterSameType;
  const bestPercent = 5;
  const examType = attempt?.is_real ? "Real" : "Simulated";

  return {
    exam,
    examName,
    startTime,
    endTime,
    status,
    sections: sectionsWithQuestions,
    sectionScores,
    questionsForReview,
    totalQuestions,
    answeredQuestions,
    correctQuestions,
    score,
    scores,
    totalScore,
    userID,
    username,
    examType,
    bestPercent
  };
};