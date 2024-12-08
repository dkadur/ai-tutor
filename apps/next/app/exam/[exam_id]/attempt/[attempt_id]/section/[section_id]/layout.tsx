import { useEffect, useState } from 'react';

import { ExamProvider } from '@/components/providers/ExamContext';
import { TimerProvider } from '@/components/providers/TimerContext';

import { getExamAttemptSection } from '@/server/functions/section/getExamAttemptSection';

import prisma from '@/lib/prisma';
import { exam_attempt_sections } from '@prisma/client';

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { attempt_id: string, section_id: string };
}>) {
  const attemptSection = await prisma.exam_attempt_sections.findFirst({
    where: {
      attempt_id: parseInt(params.attempt_id),
      section_id: parseInt(params.section_id),
    },
    include: {
      sections: {
        select: {
          type: true,
        }
      }
    }
  });

  return (
    <TimerProvider initialTime={attemptSection?.current_section_time_left!}>
      <ExamProvider>
        {children}
      </ExamProvider>
    </TimerProvider>
  );
}