"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

type Question = { r: number; c: number };
export default function Quiz({
  questions,
  onComplete,
  onStart,
  onFinish,
  onRetry,
  onQuestionChange,
}: {
  questions: Question[];
  onComplete?: (q: Question) => void;
  onStart?: () => void;
  onFinish?: () => void;
  onRetry?: () => void;
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
            <span className="font-medium">{question.r}</span> ×{" "}
            <span className="font-medium">{question.c}</span> = ?
          </div>
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              onFocus={handleFocus}
              className="w-36 text-lg"
              inputMode="numeric"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                check();
                inputRef.current?.focus();
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="text-zinc-700 dark:text-zinc-300">
            All questions completed — nice work!
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="inline-flex h-9 items-center rounded-md border border-input px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Return home
            </Link>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-9 items-center rounded-md bg-foreground px-3 text-sm font-medium text-white transition-colors hover:opacity-90 dark:bg-zinc-900"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
