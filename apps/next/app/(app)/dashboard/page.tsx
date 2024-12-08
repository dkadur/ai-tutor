import Image from "next/image";

import { getExamTypeCookie } from "@/server/actions/setExamTypeCookie";
import { getAllExams } from "@/server/functions";

import prisma from "@/lib/prisma";
import { examTypeMap } from "@/lib/utils";
import { Metadata } from "next";

import { createAttempt } from "@/server/functions/exam/create-attempt";
import { StartExamButton } from "./start-exam-button";
import { adminUserId } from "@/types";


export const metadata: Metadata = {
  title: 'Tutor Wolfie',
  description: 'Tutor Wolfie',
}

export default async function ExamPage() {

  const handleCreateAttempt = async () => {
    await createAttempt(32, true);
  };

  const userId = adminUserId; 

  const examType = await getExamTypeCookie();
  const exams = await getAllExams(examType);
  exams.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
  );

  const examAttempts = await prisma.exam_attempts.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      start_time: "desc",
    },
    include: {
      exams: {
        select: {
          name: true,
        },
      }
    },
  });

  const examsAttemptsCount = examAttempts.reduce((acc, examAttempt) => {
    const exam = examAttempt.exams;
    if (!acc[exam.name]) {
      acc[exam.name] = 0;
    }
    acc[exam.name] += 1;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="flex flex-col gap-6 px-4 md:gap-8 mb-24 md:px-0">
      <div className="flex flex-col gap-2 md:gap-4">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl font-satoshi">Take a Full Exam</h1>
        <p className="font-normal text-gray-700">Take a full exam and prepare for {examTypeMap[examType]} exam!</p>
      </div>

      <div className="flex flex-col gap-3 md:gap-4 md:gap-x-4">
        {exams.map(exam => (
          <div
            key={exam.exam_id}
            className="w-full flex flex-col max-w-full mx-auto justify-between p-4 md:p-6 duration-200 gap-2.5 md:gap-4 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-center gap-3.5">
                <Image src="/wolfie.png" alt="wolfie" width={40} height={40} />
                <p className="text-2xl font-bold md:text-3xl">{exam.name}</p>
              </div>
              <div>
                <div className="hidden md:block">
                  <StartExamButton exam={exam} />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-gray-500">
                Attempts:
                <span className="text-gray-900">{examsAttemptsCount[exam.name] || 0}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}