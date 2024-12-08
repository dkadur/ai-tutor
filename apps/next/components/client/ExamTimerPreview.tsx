"use client";

import clsx from "clsx";
import { useContext } from "react";
import { Toggle } from "../ui/toggle";
import { Clock } from "lucide-react";
import { TimerContext } from "../providers/TimerContext";

export default function ExamTimerPreview() {
  const { minutes, seconds, isShown, setIsShown } = useContext(TimerContext);
  const isTimerValid = minutes || seconds;
  const doubleDigit = (num: number) => num < 10 ? `0${num}` : num;

  return (
    <>
      {isShown
        ? <span
          className={
            clsx(
              "text-lg font-bold text-center h-6",
              {
                "text-red-500": isTimerValid && minutes < 1
              }
            )
          }
        >
          {
            isTimerValid
              ? `${doubleDigit(minutes)}:${doubleDigit(seconds)}`
              : <Clock className="w-6" />
          }
        </span>
        : <Clock className="w-6" />
      }

      <Toggle
        variant="outline"
        className="w-14 h-6 data-[state=on]:bg-gray-100 border-gray-400"
        onClick={() => setIsShown(!isShown)}
        aria-label="Toggle timer">
        {isShown ? "Hide" : "Show"}
      </Toggle>
    </>
  );
}