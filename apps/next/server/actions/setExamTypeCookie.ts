"use server";
import { ExamType } from '@wolfietutor/types';
import { cookies } from 'next/headers';

export const setExamTypeCookie = async (type: ExamType) => {
  cookies().set('examType', type);
};

export const getExamTypeCookie = async (): Promise<ExamType> => {
  const cookie = cookies().get('examType');
  if (!cookie || !cookie.value) return 'dsat';

  return cookie.value as ExamType;
};