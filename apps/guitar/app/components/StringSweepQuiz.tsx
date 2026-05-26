"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Fretboard, STRINGS, getNoteName, NOTES } from "./Fretboard";
import { type Level } from "./levels";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export default function StringSweepQuiz({ level }: { level: Level }) {
  const [frets, setFrets] = useState<number[]>([]);
  const [fretIndex, setFretIndex] = useState(0);
  const [stringIndex, setStringIndex] = useState(5);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const pool = shuffleArray(level.allowedFrets);
    const selectedFrets = pool.slice(0, Math.min(5, pool.length));
    setFrets(selectedFrets);
    setFretIndex(0);
    setStringIndex(5);
    setScore(0);
    setTotalGuesses(0);
    setSelected(null);
    setFeedback(null);
    setFinished(false);
  }, [level]);

  const currentFret = frets[fretIndex];
  const currentString = STRINGS[stringIndex];

  function reset() {
    const pool = shuffleArray(level.allowedFrets);
    const selectedFrets = pool.slice(0, Math.min(5, pool.length));
    setFrets(selectedFrets);
    setFretIndex(0);
    setStringIndex(5);
    setScore(0);
    setTotalGuesses(0);
    setSelected(null);
    setFeedback(null);
    setFinished(false);
  }

  function advance() {
    if (stringIndex > 0) {
      setStringIndex((s) => s - 1);
      setSelected(null);
      setFeedback(null);
    } else {
      const nextFret = fretIndex + 1;
      if (nextFret >= frets.length) {
        setFinished(true);
      } else {
        setFretIndex(nextFret);
        setStringIndex(5);
        setSelected(null);
        setFeedback(null);
      }
    }
  }

  function handleGuess(note: string) {
    if (!currentString || feedback || currentFret == null) return;

    const correctNote = getNoteName(currentString.note, currentFret);
    setSelected(note);
    setTotalGuesses((t) => t + 1);

    if (note === correctNote) {
      setFeedback("correct");
      setScore((s) => s + 1);
    } else {
      setFeedback("incorrect");
    }

    setTimeout(() => {
      advance();
    }, 1200);
  }

  const noteButtons = useMemo((): string[] => {
    return NOTES;
  }, []);

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Stage Complete!</h2>
          <p className="text-muted-foreground">
            {level.name} — {level.description}
          </p>
          <p className="text-muted-foreground">
            You got {score} out of {totalGuesses} correct.
          </p>
        </div>
        <div className="flex gap-3">
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Stage Select</Link>
          </Button>
          <Button size="lg" onClick={reset}>
            Retry Stage
          </Button>
        </div>
      </div>
    );
  }

  if (currentFret == null || !currentString) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            Stage {level.id}
          </span>{" "}
          — Fret {fretIndex + 1} of {frets.length}
        </div>
        <div className="text-sm text-muted-foreground">
          Score: {score} / {totalGuesses}
        </div>
      </div>

      <Fretboard
        highlight={{ stringIndex, fret: currentFret }}
        showNotes={false}
      />

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => setShowLabel((v) => !v)}
          className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {showLabel ? (
            <>
              <EyeOff className="size-4" />
              Hide position
            </>
          ) : (
            <>
              <Eye className="size-4" />
              Show position
            </>
          )}
        </button>

        {showLabel && (
          <div className="text-lg font-medium">
            Fret {currentFret}, String {stringIndex + 1}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {noteButtons.map((note) => {
            const isSelected = selected === note;
            const isCorrect =
              getNoteName(currentString.note, currentFret) === note;
            let variant: "default" | "outline" | "secondary" | "destructive" =
              "outline";
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
                key={note}
                variant={variant}
                className="min-w-[3.5rem]"
                onClick={() => handleGuess(note)}
                disabled={!!feedback}
              >
                {note}
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
              : `Incorrect — it was ${getNoteName(currentString.note, currentFret)}`}
          </div>
        )}
      </div>
    </div>
  );
}
