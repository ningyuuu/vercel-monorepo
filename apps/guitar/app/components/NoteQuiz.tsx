"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Fretboard, STRINGS, getNoteName, NOTES } from "./Fretboard";
import { type Level } from "./levels";

export type Question = {
  stringIndex: number;
  fret: number;
  note: string;
};

function generateQuestions(count = 10, allowedFrets: number[]): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const stringIndex = Math.floor(Math.random() * STRINGS.length);
    const fret =
      allowedFrets[Math.floor(Math.random() * allowedFrets.length)] ?? 0;
    const note = getNoteName(STRINGS[stringIndex]!.note, fret);
    questions.push({ stringIndex, fret, note });
  }
  return questions;
}

export default function NoteQuiz({ level }: { level: Level }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    setQuestions(generateQuestions(10, level.allowedFrets));
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setFinished(false);
  }, [level]);

  const current = questions[index];

  function reset() {
    setQuestions(generateQuestions(10, level.allowedFrets));
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setFinished(false);
  }

  function handleGuess(note: string) {
    if (!current || feedback) return;
    setSelected(note);
    if (note === current.note) {
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
            You got {score} out of {questions.length} correct.
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Stage {level.id}</span>{" "}
          — Question {index + 1} of {questions.length}
        </div>
        <div className="text-sm text-muted-foreground">
          Score: {score} / {index + (feedback ? 1 : 0)}
        </div>
      </div>

      <Fretboard
        highlight={
          current
            ? { stringIndex: current.stringIndex, fret: current.fret }
            : null
        }
        showNotes={false}
      />

      {current && (
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
              String {current.stringIndex + 1},{" "}
              {current.fret === 0 ? "open" : `fret ${current.fret}`}
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {noteButtons.map((note) => {
              const isSelected = selected === note;
              const isCorrect = current.note === note;
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
                : `Incorrect — it was ${current.note}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
