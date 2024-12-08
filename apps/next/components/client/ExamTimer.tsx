"use client";

import { useContext, useEffect, useState } from 'react';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Eye, EyeOff, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

import { invalidateExamAttempt } from '@/server/actions/invalidateExamAttempt';

import { TimerContext } from '../providers/TimerContext';
import { Toggle } from '../ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface ExamTimerProps {
  isExamOver: boolean;
  isExamReal: boolean;
}

export default function ExamTimer({ isExamOver, isExamReal }: ExamTimerProps) {
  const { exam_id, attempt_id, section_id, question_number } = useParams();
  const { minutes, seconds, isShown, setIsShown, setIsPaused } = useContext(TimerContext);
  const isTimerValid = minutes || seconds;
  const doubleDigit = (num: number) => (num < 10 ? `0${num}` : num);
  const timeReachedZero = minutes === 0 && seconds === 0;
  const [openDialog, setOpenDialog] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setOpenDialog(false);

    if (isExamOver) {
      setIsPaused(true);
    }
  }, [isExamOver, setIsPaused]);

  useEffect(() => {
    if (!isExamOver && isExamReal) {
      setOpenDialog(timeReachedZero);
    }
  }, [timeReachedZero, isExamOver, isExamReal]);

  useEffect(() => {
    let warningTimer: NodeJS.Timeout;
    if (minutes === 5 && seconds === 0) {
      setShowWarning(true);
    }

    // After 30 seconds, hide the warning
    if (minutes === 4 && seconds === 30) {
      setShowWarning(false);
    }
    return () => clearTimeout(warningTimer);
  }, [minutes, seconds]);

  return (
    <div className="relative flex gap-2">
      <Tooltip>
        <TooltipTrigger>
          <div
            className="border border-gray-100 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center gap-2 px-3 py-3 md:px-4 md:py-3.5 cursor-pointer select-none md:w-28 w-24"
            onClick={() => setIsShown(!isShown)}
          >
            <Toggle
              className='flex items-center gap-2 px-0 py-0 h-auto data-[state=on]:bg-transparent data-[state=off]:bg-transparent data-[state=off]:text-gray-900'
              aria-label="Toggle timer"
            >
              {isShown ? (
                <span className={clsx("font-bold", { "text-red-500": isTimerValid && minutes < 5 })}>
                  {isTimerValid ? `${doubleDigit(minutes)}:${doubleDigit(seconds)}` : <Clock className='text-gray-700' size={16} />}
                </span>
              ) : (
                <p className='font-bold text-gray-700'>Show</p>
              )}
              <AlertDialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Time&apos;s up!</AlertDialogTitle>
                    <AlertDialogDescription>
                      You can choose to continue working on this section, but your exam will be marked as simulated! To avoid this, you can decide to continue to the next section.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      <Link href={`/exam/${exam_id}/attempt/${attempt_id}/section/${section_id}/end`}>Go to next section</Link>
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={async () => await invalidateExamAttempt(exam_id.toString(), attempt_id.toString(), section_id.toString())}>
                      Continue working on this section
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {isTimerValid ? (isShown
                ? <Eye className='text-gray-700 hover:cursor-pointer hover:text-gray-900' size={20} />
                : <EyeOff className='text-gray-700 hover:cursor-pointer hover:text-gray-900' size={20} />
              ) : null}
            </Toggle>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className='font-bold text-gray-700'>{isShown ? 'Hide timer' : 'Show timer'}</p>
        </TooltipContent>
      </Tooltip>

      <AnimatePresence>
        {showWarning && (
          <motion.div className="absolute top-0 translate-x-[100%] items-center justify-center hidden w-32 p-1 text-sm font-semibold text-center text-red-500 bg-red-100 border border-red-500 rounded md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            5 minutes remaining!
            <XCircle onClick={() => setShowWarning(false)} className="ml-2 cursor-pointer" size={36} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
