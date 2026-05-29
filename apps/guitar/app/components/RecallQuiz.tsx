"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Fretboard, STRINGS, getNoteName, NOTES } from "./Fretboard";
import { type Level } from "./levels";

type Phase = "learning" | "learning-done" | "recalling" | "done";

const MAX_FRETS = 5;

export default function RecallQuiz({ level }: { level: Level }) {
  const [phase, setPhase] = useState<Phase>("learning");
  const [frets, setFrets] = useState<number[]>([]);
  const [fretIndex, setFretIndex] = useState(0);
  const [stringIndex, setStringIndex] = useState(5);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [learnScore, setLearnScore] = useState(0);
  const [learnTotal, setLearnTotal] = useState(0);
  const [recallScore, setRecallScore] = useState(0);
  const [recallTotal, setRecallTotal] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const fretsRef = useRef<number[]>([]);

  useEffect(() => {
    const selected = level.allowedFrets.slice(0, MAX_FRETS);
    fretsRef.current = selected;
    setFrets(selected);
    setPhase("learning");
    setFretIndex(0);
    setStringIndex(5);
    setSelected(null);
    setFeedback(null);
    setLearnScore(0);
    setLearnTotal(0);
    setRecallScore(0);
    setRecallTotal(0);
  }, [level]);

  const currentFret = frets[fretIndex];
  const currentString = STRINGS[stringIndex];
  const showNotes = phase === "learning";
  const score = phase === "recalling" ? recallScore : learnScore;
  const total = phase === "recalling" ? recallTotal : learnTotal;

  function reset() {
    setPhase("learning");
    setFretIndex(0);
    setStringIndex(5);
    setSelected(null);
    setFeedback(null);
    setLearnScore(0);
    setLearnTotal(0);
    setRecallScore(0);
    setRecallTotal(0);
  }

  function startRecall() {
    setFrets(fretsRef.current);
    setPhase("recalling");
    setFretIndex(0);
    setStringIndex(5);
    setSelected(null);
    setFeedback(null);
  }

  function advance() {
    if (stringIndex > 0) {
      setStringIndex((s) => s - 1);
      setSelected(null);
      setFeedback(null);
    } else {
      const nextFret = fretIndex + 1;
      if (nextFret >= frets.length) {
        if (phase === "learning") {
          setPhase("learning-done");
        } else {
          setPhase("done");
        }
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

    if (phase === "learning") {
      setLearnTotal((t) => t + 1);
    } else {
      setRecallTotal((t) => t + 1);
    }

    if (note === correctNote) {
      setFeedback("correct");
      if (phase === "learning") {
        setLearnScore((s) => s + 1);
      } else {
        setRecallScore((s) => s + 1);
      }
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

  if (phase === "learning-done") {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Learning Complete!</h2>
          <p className="text-muted-foreground">
            You got {learnScore} out of {learnTotal} correct with the notes
            visible.
          </p>
          <p className="text-muted-foreground">
            Now test your recall — same frets, notes hidden.
          </p>
        </div>
        <Button size="lg" onClick={startRecall}>
          Start Recall
        </Button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Recall Complete!</h2>
          <p className="text-muted-foreground">
            {level.name} — {level.description}
          </p>
          <div className="mt-4 space-y-1">
            <p className="text-muted-foreground">
              Learn: {learnScore} / {learnTotal} correct
            </p>
            <p className="text-muted-foreground">
              Recall: {recallScore} / {recallTotal} correct
            </p>
          </div>
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
          —{showNotes ? " Learn" : " Recall"} · Fret {fretIndex + 1} of{" "}
          {frets.length}
        </div>
        <div className="text-sm text-muted-foreground">
          Score: {score} / {total}
        </div>
      </div>

      <Fretboard
        highlight={{ stringIndex, fret: currentFret }}
        showNotes={showNotes}
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
