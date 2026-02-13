"use client";
import React, { useState } from "react";
import Timestable from "./Timestable";
import Quiz from "./Quiz";

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

  const [questions, setQuestions] = React.useState<Question[] | null>(null);

  React.useEffect(() => {
    setQuestions(generateQuestions(20));
  }, []);

  function handleComplete(q: { r: number; c: number }) {
    const key = `${q.r}x${q.c}`;
    setCompleted((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <Timestable completed={completed} />
      </div>
      <div>
        {questions ? (
          <Quiz questions={questions} onComplete={handleComplete} />
        ) : (
          <div className="w-full px-6">Loading quiz…</div>
        )}
      </div>
    </div>
  );
}
