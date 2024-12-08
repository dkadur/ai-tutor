"use client";

import { useParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import { invalidateExamAttempt } from '@/server/actions/invalidateExamAttempt';

import { ActionButton } from '../feature/exam/action-button';

export default function ExitButton({
  isExamOver, isExamReal
}: { isExamOver?: boolean, isExamReal: boolean}) {
  const router = useRouter();
  const { exam_id, attempt_id, section_id } = useParams();

  const handleExit = async () => {
    if (!isExamOver) {
      if (isExamReal) {
        await invalidateExamAttempt(exam_id.toString(), attempt_id.toString(), section_id.toString());
      }
    }
    router.push("/dashboard");
  };

  return (
    isExamOver || !isExamReal
      ? (
        <ActionButton icon="LogOut" onClick={handleExit} className='text-red-600' />
      ) : (
        <AlertDialog>
          <AlertDialogTrigger>
            <ActionButton icon="LogOut" className='text-red-600' />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="font-medium">
                Exiting exam will mark the exam as simulated. A simulated exam <b>won&apos;t</b> affect your profile analytics.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-4 md:flex-row">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleExit}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

  );
}