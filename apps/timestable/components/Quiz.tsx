"use client";
import React, { useState, useEffect, useRef } from "react";

type Question = { r: number; c: number };
export default function Quiz({
  questions,
  onComplete,
  onStart,
  onFinish,
  onQuestionChange,
}: {
  questions: Question[];
  onComplete?: (q: Question) => void;
  onStart?: () => void;
  onFinish?: () => void;
  onQuestionChange?: (q: Question | null) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [started, setStarted] = useState(false);

  // reset when questions change
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setIndex(0);
    setAnswer("");
    setStarted(false);
  }, [questions]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const question = questions[index];
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    onQuestionChange?.(question ?? null);
  }, [question, onQuestionChange]);

  function handleFocus() {
    // Delay to allow mobile keyboard to open, then scroll input into view
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }

  function check(e?: React.FormEvent) {
    e?.preventDefault();
    if (!question) return;
    if (!started) {
      setStarted(true);
      onStart?.();
    }
    const expected = question.r * question.c;
    if (parseInt(answer, 10) === expected) {
      onComplete?.(question);
      setAnswer("");
      setIndex(index + 1);
      if (index + 1 >= questions.length) {
        onFinish?.();
      }
    }
  }

  return (
    <div className="w-full px-3 sm:px-6">
      {question ? (
        <form onSubmit={check} className="flex flex-col gap-3">
          <div className="text-lg text-zinc-800 dark:text-zinc-200">
            What is <span className="font-medium">{question.r}</span> ×{" "}
            <span className="font-medium">{question.c}</span>?
          </div>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              onFocus={handleFocus}
              className="w-36 rounded border border-zinc-300 px-3 py-2 text-lg dark:bg-zinc-900 dark:text-zinc-50"
              inputMode="numeric"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                check();
                inputRef.current?.focus();
              }}
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
