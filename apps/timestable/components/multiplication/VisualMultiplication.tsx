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
    Record<string, boolean>
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

  const rowParts = splitIntoTensAndOnes(currentQuestion.r);
  const colParts = splitIntoTensAndOnes(currentQuestion.c);
  const totalWidth = rowParts.reduce((sum, part) => sum + part, 0);
  const totalHeight = colParts.reduce((sum, part) => sum + part, 0);
  const rectHeight = Math.max(96, Math.min(240, totalHeight * 12));

  function handleReveal(key: string) {
    setRevealedByIndex((prev) => ({ ...prev, [key]: true }));
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
        <div className="flex gap-2">
          <div
            className="mt-6 flex w-6 flex-col gap-1"
            style={{ height: `${rectHeight}px` }}
          >
            {colParts.map((colPart, index) => (
              <div
                key={`left-${colPart}-${index}`}
                className="flex items-center justify-center text-xs font-medium text-zinc-700 dark:text-zinc-200"
                style={{ height: `${(colPart / totalHeight) * 100}%` }}
              >
                {colPart}
              </div>
            ))}
          </div>

          <div className="flex-1">
            <div className="mb-1 flex gap-1">
              {rowParts.map((rowPart, index) => (
                <div
                  key={`top-${rowPart}-${index}`}
                  className="text-center text-xs font-medium text-zinc-700 dark:text-zinc-200"
                  style={{ width: `${(rowPart / totalWidth) * 100}%` }}
                >
                  {rowPart}
                </div>
              ))}
            </div>

            <div className="flex gap-1" style={{ height: `${rectHeight}px` }}>
              {rowParts.map((rowPart, rowIndex) => (
                <div
                  key={`col-${rowPart}-${rowIndex}`}
                  className="flex flex-col gap-1"
                  style={{ width: `${(rowPart / totalWidth) * 100}%` }}
                >
                  {colParts.map((colPart, colIndex) => {
                    const key = `${rowIndex}-${colIndex}`;
                    return (
                      <button
                        key={`${rowPart}-${colPart}-${rowIndex}-${colIndex}`}
                        type="button"
                        onClick={() => handleReveal(key)}
                        className="rounded-md border border-zinc-400 bg-zinc-100 text-center text-sm font-semibold text-zinc-900 dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-50"
                        aria-label={`Reveal ${rowPart} times ${colPart}`}
                        style={{ height: `${(colPart / totalHeight) * 100}%` }}
                      >
                        {revealedByIndex[key] ? rowPart * colPart : null}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
