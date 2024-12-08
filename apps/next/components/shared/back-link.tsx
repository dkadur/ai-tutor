"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useRouter } from 'nextjs-toploader/app';
import { Button } from "../ui/button";

export const BackLink = ({ title }: { title?: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const pathnameTitle = pathname.includes("exam_attempt") ? "Exam Attempts" : pathname.split("/").pop();

  return (
    <Button variant="ghost" className="text-customIndigo hover:underline cursor-pointer" onClick={() => router.back()}>
      {'<'} Back to {title || pathnameTitle}
    </Button>
  );
};