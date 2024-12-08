"use client";
import { Button } from "@/components/ui/button";
import { createAttempt } from "@/server/functions/exam/create-attempt";
import { useState } from "react";

export const StartExamButton = ({ exam }: { exam: any }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAttempt = async () => {
    setIsLoading(true);
    await createAttempt(32, true);
  };

    return (
      <Button variant="primary" className="w-[120px]" onClick={handleCreateAttempt} disabled={isLoading}>{!isLoading ? "Take exam!" : "Loading..."}</Button>
    );
}