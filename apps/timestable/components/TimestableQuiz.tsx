"use client";
import React, { useEffect, useState } from "react";
import Timestable from "./Timestable";
import Quiz from "./Quiz";
import Timer from "./Timer";
import Progress from "./Progress";

type Question = { r: number; c: number };

function generateQuestions(count = 20): Question[] {
  const all: Question[] = [];
  for (let r = 2; r <= 9; r++) {
    for (let c = 2; c <= 9; c++) {
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

export default function TimestablePlayground() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[] | null>(null);

  // signals to control the Timer component
  const [startSignal, setStartSignal] = useState(0);
  const [stopSignal, setStopSignal] = useState(0);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setQuestions(generateQuestions(20));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

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
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <Timestable completed={completed} />
      </div>
      <div>
        <div className="w-full px-6 mb-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Quiz
            </h2>
            <Timer startSignal={startSignal} stopSignal={stopSignal} />
          </div>
          <Progress total={questions?.length} filled={completed.length} />
        </div>

        {questions ? (
          <Quiz
            questions={questions}
            onComplete={handleComplete}
            onStart={handleStartTimer}
            onFinish={handleFinishTimer}
          />
        ) : (
          <div className="w-full px-6">Loading quiz…</div>
        )}
      </div>
    </div>
  );
}
