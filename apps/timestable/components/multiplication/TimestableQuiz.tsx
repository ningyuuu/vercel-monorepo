"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import HelperPanel from "./HelperPanel";
import Quiz from "./Quiz";
import Timer from "../Timer";
import Progress from "../Progress";

type Question = { r: number; c: number };

type Range = {
  min: number;
  max: number;
};

function generateQuestions(
  count = 20,
  firstDigitRange: Range = { min: 2, max: 9 },
  secondDigitRange: Range = { min: 2, max: 9 },
): Question[] {
  const all: Question[] = [];
  for (let r = firstDigitRange.min; r <= firstDigitRange.max; r++) {
    for (let c = secondDigitRange.min; c <= secondDigitRange.max; c++) {
      all.push({ r, c });
    }
  }

  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = all[i];
    all[i] = all[j];
    all[j] = tmp;
  }

  return all.slice(0, Math.min(count, all.length));
}

export default function TimestablePlayground({
  firstDigitRange = { min: 2, max: 9 },
  secondDigitRange = { min: 2, max: 9 },
}: {
  firstDigitRange?: Range;
  secondDigitRange?: Range;
}) {
  const rangeKey = `${firstDigitRange.min}-${firstDigitRange.max}-${secondDigitRange.min}-${secondDigitRange.max}`;

  return (
    <TimestablePlaygroundSession
      key={rangeKey}
      firstDigitRange={firstDigitRange}
      secondDigitRange={secondDigitRange}
    />
  );
}

function TimestablePlaygroundSession({
  firstDigitRange,
  secondDigitRange,
}: {
  firstDigitRange: Range;
  secondDigitRange: Range;
}) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>(() =>
    generateQuestions(20, firstDigitRange, secondDigitRange),
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // signals to control the Timer component
  const [startSignal, setStartSignal] = useState(0);
  const [stopSignal, setStopSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);

  function resetQuiz() {
    setQuestions(generateQuestions(20, firstDigitRange, secondDigitRange));
    setCompleted([]);
    setCurrentQuestion(null);
    setResetSignal((s) => s + 1);
  }

  function handleComplete(q: { r: number; c: number }) {
    const key = `${q.r}x${q.c}`;
    setCompleted((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  function handleStartTimer() {
    setStartSignal((s) => s + 1);
  }

  function handleFinishTimer() {
    setStopSignal((s) => s + 1);
  }

  return (
    <div>
      <div className="mb-4 px-3 sm:px-6">
        <Button size="sm" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <HelperPanel completed={completed} currentQuestion={currentQuestion} />
        <div>
          <div className="mb-4 w-full px-3 sm:px-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Quiz
              </h2>
              <Timer
                startSignal={startSignal}
                stopSignal={stopSignal}
                resetSignal={resetSignal}
              />
            </div>
            <Progress total={questions?.length} filled={completed.length} />
          </div>

          <Quiz
            questions={questions}
            onComplete={handleComplete}
            onStart={handleStartTimer}
            onFinish={handleFinishTimer}
            onRetry={resetQuiz}
            onQuestionChange={setCurrentQuestion}
          />
        </div>
      </div>
    </div>
  );
}
