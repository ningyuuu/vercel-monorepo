"use client";
import React, { useState, useEffect } from "react";

type Question = { r: number; c: number };

// TODO: randomly select n questions from full set
const allQuestions: Question[] = Array.from({ length: 9 }, (_, ri) =>
  Array.from({ length: 9 }, (_, ci) => ({ r: ri + 1, c: ci + 1 })),
).flat();

function pickNext(exclude: Set<string>): Question | undefined {
  const pool = allQuestions.filter((q) => !exclude.has(`${q.r}x${q.c}`));
  if (pool.length === 0) return undefined;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Quiz({
  onComplete,
}: {
  onComplete?: (q: Question) => void;
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [answer, setAnswer] = useState("");

  // pick the initial question on the client to avoid SSR/client hydration
  // run once on mount only
  useEffect(() => setQuestion((q) => q ?? pickNext(new Set())), []);

  function check(e?: React.FormEvent) {
    e?.preventDefault();
    if (!question) return;
    const expected = question.r * question.c;
    if (parseInt(answer, 10) === expected) {
      const key = `${question.r}x${question.c}`;
      setCompleted((prev) => new Set(prev).add(key));
      onComplete?.(question);
      setAnswer("");

      const excluded = new Set<string>([...Array.from(completed), key]);
      const nextQ = pickNext(excluded);
      setQuestion(nextQ);
    }
  }

  return (
    <div className="w-full px-6">
      <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Quiz
      </h2>
      {question ? (
        <form onSubmit={check} className="flex flex-col gap-3">
          <div className="text-lg text-zinc-800 dark:text-zinc-200">
            What is <span className="font-medium">{question.r}</span> ×{" "}
            <span className="font-medium">{question.c}</span>?
          </div>
          <input
            className="w-36 rounded border border-zinc-300 px-3 py-2 text-lg dark:bg-zinc-900 dark:text-zinc-50"
            inputMode="numeric"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded bg-foreground px-4 py-2 text-white dark:bg-zinc-900"
            >
              Submit
            </button>
          </div>
        </form>
      ) : (
        <div className="text-zinc-700 dark:text-zinc-300">
          All questions completed — nice work!
        </div>
      )}
    </div>
  );
}
