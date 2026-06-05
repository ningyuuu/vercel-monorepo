"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Fretboard } from "./Fretboard";
import type { Level } from "./levels";
import type { ChordDef } from "./chords";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function pickOptions(correct: ChordDef, pool: ChordDef[], count = 4): string[] {
  const others = pool.filter((c) => c.slug !== correct.slug);
  const shuffled = shuffle(others).slice(0, count - 1);
  const options = [correct.name, ...shuffled.map((c) => c.name)];
  return shuffle(options);
}

export default function ChordQuiz({
  level,
  onComplete,
  onBack,
  passThreshold,
  mode = "standalone",
}: {
  level: Level;
  onComplete?: () => void;
  onBack?: () => void;
  passThreshold?: number;
  mode?: "standalone" | "course";
}) {
  const chords = useMemo(() => level.chords ?? [], [level.chords]);

  const [questions, setQuestions] = useState<ChordDef[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (chords.length === 0) return;
    const picked = shuffle(chords).slice(0, Math.min(10, chords.length));
    setQuestions(picked);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setFinished(false);
  }, [chords]);

  const current = questions[index];
  const options = useMemo(
    () => (current ? pickOptions(current, chords) : []),
    [current, chords],
  );

  function reset() {
    const picked = shuffle(chords).slice(0, Math.min(10, chords.length));
    setQuestions(picked);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setFinished(false);
  }

  function handleGuess(name: string) {
    if (!current || feedback) return;
    setSelected(name);
    if (name === current.name) {
      setFeedback("correct");
      setScore((s) => s + 1);
    } else {
      setFeedback("incorrect");
    }
    setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex >= questions.length) {
        setFinished(true);
      } else {
        setIndex(nextIndex);
        setSelected(null);
        setFeedback(null);
      }
    }, 1500);
  }

  if (chords.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-muted-foreground">No chords defined for this level.</p>
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Stage Select</Link>
        </Button>
      </div>
    );
  }

  if (finished) {
    const ratio = questions.length > 0 ? score / questions.length : 0;
    const passed = passThreshold !== undefined ? ratio >= passThreshold : true;

    if (mode === "course") {
      return (
        <div className="flex flex-col items-center gap-6 py-12">
          <div className="text-center space-y-2">
            {passed ? (
              <>
                <h2 className="text-2xl font-semibold">Passed!</h2>
                <p className="text-muted-foreground">
                  You got {score} out of {questions.length} correct.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold">Keep Trying</h2>
                <p className="text-muted-foreground">
                  You got {score} out of {questions.length} correct.
                  Need {Math.round((passThreshold ?? 0) * 100)}% to pass.
                </p>
              </>
            )}
          </div>
          <div className="flex gap-3">
            <Button size="lg" variant="outline" onClick={reset}>
              Retry
            </Button>
            {passed && onComplete && (
              <Button size="lg" onClick={onComplete}>Complete</Button>
            )}
            {!passed && onBack && (
              <Button size="lg" variant="outline" onClick={onBack}>
                Back to Course
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Stage Complete!</h2>
          <p className="text-muted-foreground">
            {level.name} — {level.description}
          </p>
          <p className="text-muted-foreground">
            You got {score} out of {questions.length} correct.
          </p>
        </div>
        <div className="flex gap-3">
          <Button size="lg" variant="outline" asChild>
          <Link href="/chords">Stage Select</Link>
          </Button>
          <Button size="lg" onClick={reset}>
            Retry Stage
          </Button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{level.name}</span>{" "}
          — Question {index + 1} of {questions.length}
        </div>
        <div className="text-sm text-muted-foreground">
          Score: {score} / {index + (feedback ? 1 : 0)}
        </div>
      </div>

      <Fretboard
        highlights={current.positions}
        showNotes={false}
        muted={current.muted}
      />

      {current && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Which chord is this?
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 max-w-md w-full">
            {options.map((name) => {
              const isSelected = selected === name;
              const isCorrect = current.name === name;
              let variant:
                | "default"
                | "outline"
                | "secondary"
                | "destructive" = "outline";
              if (feedback) {
                if (isCorrect) {
                  variant = "default";
                } else if (isSelected) {
                  variant = "destructive";
                }
              } else if (isSelected) {
                variant = "secondary";
              }

              return (
                <Button
                  key={name}
                  variant={variant}
                  className="min-h-[3rem]"
                  onClick={() => handleGuess(name)}
                  disabled={!!feedback}
                >
                  {name}
                </Button>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`text-sm font-medium ${
                feedback === "correct" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {feedback === "correct"
                ? "Correct!"
                : `Incorrect — it was ${current.name}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
