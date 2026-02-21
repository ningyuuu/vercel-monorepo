"use client";
import React from "react";

type Question = { r: number; c: number };

function splitIntoTensAndOnes(value: number): number[] {
  if (value <= 10) return [value];
  const tens = Math.floor(value / 10) * 10;
  const ones = value % 10;
  return ones === 0 ? [value] : [tens, ones];
}

export default function VisualMultiplication({
  currentQuestion,
}: {
  currentQuestion: Question | null;
}): React.ReactElement {
  const [revealedByIndex, setRevealedByIndex] = React.useState<
    Record<number, boolean>
  >({});
  const questionKey = currentQuestion
    ? `${currentQuestion.r}x${currentQuestion.c}`
    : "none";

  React.useEffect(() => {
    setRevealedByIndex({});
  }, [questionKey]);

  if (!currentQuestion) {
    return (
      <div className="w-full px-3 text-sm text-zinc-600 sm:px-6 dark:text-zinc-300">
        Start the quiz to see the current question visualized here.
      </div>
    );
  }

  const parts = splitIntoTensAndOnes(currentQuestion.r);
  const total = parts.reduce((sum, part) => sum + part, 0);
  const side = currentQuestion.c;
  const rectHeight = Math.max(72, Math.min(180, side * 12));

  function handleReveal(index: number) {
    setRevealedByIndex((prev) => ({ ...prev, [index]: true }));
  }

  return (
    <div className="w-full px-3 sm:px-6">
      <div className="mb-3 text-sm text-zinc-700 dark:text-zinc-200">
        Current: <span className="font-medium">{currentQuestion.r}</span> ×{" "}
        <span className="font-medium">{currentQuestion.c}</span>
      </div>

      <div className="rounded-xl border border-border bg-background p-3">
        <div className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
          Area model
        </div>
        <div className="flex items-stretch gap-1">
          {parts.map((part, index) => (
            <button
              key={`${part}-${index}`}
              type="button"
              onClick={() => handleReveal(index)}
              className="relative rounded-md border border-zinc-400 bg-zinc-100 text-left dark:border-zinc-500 dark:bg-zinc-800"
              aria-label={`Reveal ${part} times ${side}`}
              style={{
                width: `${(part / total) * 100}%`,
                height: `${rectHeight}px`,
              }}
            >
              <div className="absolute left-1 top-1 text-xs font-medium text-zinc-700 dark:text-zinc-200">
                {part}
              </div>
              <div className="absolute bottom-1 left-1 text-xs text-zinc-700 dark:text-zinc-200">
                {side}
              </div>
              <div className="absolute inset-x-0 bottom-1 text-center text-xs font-medium text-zinc-800 dark:text-zinc-100">
                {part} x {side}
              </div>
              {revealedByIndex[index] ? (
                <div className="absolute inset-x-0 top-1 text-center text-xs font-semibold text-zinc-900 dark:text-zinc-50">
                  = {part * side}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
