"use client";
import React, { createContext, useEffect, useState } from 'react';

interface Time {
  minutes: number;
  seconds: number;
}

interface TimerContextType {
  minutes: number;
  seconds: number;
  setTime: (time: Time) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  isShown: boolean;
  setIsShown: (isShown: boolean) => void;
  remainingTime: number;
}

export const TimerContext = createContext<TimerContextType>({
  minutes: 0,
  seconds: 0,
  setTime: () => { },
  isPaused: false,
  setIsPaused: () => { },
  isShown: true,
  setIsShown: () => { },
  remainingTime: 0,
});

interface TimerProviderProps {
  children: React.ReactNode;
  initialTime: number;
}

export const TimerProvider = ({ children, initialTime }: TimerProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [time, setTime] = useState<Time>({ minutes: 0, seconds: 0 });
  const [remainingTime, setRemainingTime] = useState(0);
  const [isShown, setIsShown] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const initialMinutes = Math.floor(initialTime / 60);
    const initialSeconds = initialTime % 60;

    setTime({ minutes: initialMinutes, seconds: initialSeconds });
    setIsInitialized(true);
  }, [initialTime]);

  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      if ((time.minutes === 0 && time.seconds === 0) || isPaused) {
        clearInterval(interval);
      } else if (time.seconds === 0) {
        setTime({
          minutes: time.minutes - 1,
          seconds: 59
        });
      } else {
        setTime({
          minutes: time.minutes,
          seconds: time.seconds - 1
        });
      }
    }, 1000);

    setRemainingTime(time.minutes * 60 + time.seconds);

    return () => clearInterval(interval);
  }, [time, isInitialized, isPaused]);

  return (
    <TimerContext.Provider
      value={{
        minutes: time.minutes,
        seconds: time.seconds,
        setTime,
        isShown,
        setIsShown,
        isPaused,
        setIsPaused,
        remainingTime
      }}>
      {children}
    </TimerContext.Provider>
  );
};
