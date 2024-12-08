import { LogOut } from "lucide-react";
import Link from "next/link";
import ExamTimerPreview from "../ExamTimerPreview";

interface ExamLayoutProps {
  children: React.ReactNode;
  sectionName?: string;
  exitHref: string;
}

export default function ExamLayoutPreview({
  children,
  sectionName,
  exitHref,
}: ExamLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-around items-center px-6 py-2 border">
        <div className=" flex-1 flex flex-col gap-2">
          <span className="text-xl font-semibold">{sectionName}</span>
          <small>Preview</small>
        </div>

        <div className="flex-1 flex flex-col items-center gap-2">
          <ExamTimerPreview />
        </div>

        <span className="flex-1 flex justify-end gap-1">
          <Link href={exitHref} className="flex flex-col items-center gap-1 p-2 w-20 rounded hover:bg-gray-200 active:bg-gray-300">
            <LogOut color="red" size={20} />
            <span className="text-sm text-red-500">exit</span>
          </Link>
        </span>
      </nav>
      <section className="flex-grow">
        {children}
      </section>
    </div>
  );
}