"use client";
import React, { useState, useEffect } from "react";

type Question = { r: number; c: number };
export default function Quiz({
  questions,
  onComplete,
}: {
  questions: Question[];
  onComplete?: (q: Question) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  // reset when questions change
  useEffect(() => {
    setIndex(0);
    setAnswer("");
  }, [questions]);

  const question = questions[index];

  function check(e?: React.FormEvent) {
    e?.preventDefault();
    if (!question) return;
    const expected = question.r * question.c;
    if (parseInt(answer, 10) === expected) {
      onComplete?.(question);
      setAnswer("");
      setIndex((i) => i + 1);
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
