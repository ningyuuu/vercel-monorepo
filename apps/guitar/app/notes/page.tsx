"use client";

import { useMemo, useState } from "react";
import { Button } from "@repo/ui/button";
import { Eye, EyeOff, Play, BookOpen } from "lucide-react";
import { Fretboard, NOTES } from "../components/Fretboard";
import { generateQuestions, generateSweepQuestions } from "@/lib/questions";
import type { Question } from "../components/NoteQuiz";

type PracticeMode = "revise" | "quiz";

interface Preset {
  label: string;
  frets: number[];
}

const PRESETS: Preset[] = [
  { label: "Key Frets", frets: [0, 3, 5, 7, 9] },
  { label: "0 – 3", frets: [0, 1, 2, 3] },
  { label: "4 – 6", frets: [4, 5, 6] },
  { label: "7 – 9", frets: [7, 8, 9] },
  { label: "10 – 12", frets: [10, 11, 12] },
  { label: "All", frets: Array.from({ length: 20 }, (_, i) => i) },
];

function parseFrets(input: string): number[] {
  if (!input.trim()) return [];
  const frets = new Set<number>();
  const parts = input.split(",");
  for (const raw of parts) {
    const part = raw.trim();
    if (!part) continue;
    if (part.includes("-")) {
      const [s, e] = part.split("-");
      const start = Number(s?.trim());
      const end = Number(e?.trim());
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let f = Math.max(0, start); f <= Math.min(19, end); f++) {
          frets.add(f);
        }
      }
    } else {
      const n = Number(part);
      if (!isNaN(n) && n >= 0 && n <= 19) {
        frets.add(n);
      }
    }
  }
  return Array.from(frets).sort((a, b) => a - b);
}

export default function NotesPage() {
  const [mode, setMode] = useState<PracticeMode>("revise");
  const [activePreset, setActivePreset] = useState<number | "custom">(0);
  const [customInput, setCustomInput] = useState("");
  const [customFrets, setCustomFrets] = useState<number[]>([]);
  const [showNotes, setShowNotes] = useState(true);

  // quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const frets =
    activePreset === "custom" ? customFrets : PRESETS[activePreset]!.frets;

  const presetLabel =
    activePreset === "custom"
      ? `Custom (${frets.length > 0 ? frets.join(",") : "none"})`
      : PRESETS[activePreset]!.label;

  function startQuiz() {
    if (frets.length === 0) return;
    const qs =
      mode === "revise"
        ? generateSweepQuestions(frets)
        : generateQuestions(10, frets);
    setQuestions(qs);
    setQuestionIndex(0);
    setSelected(null);
    setFeedback(null);
    setQuizStarted(true);
    setQuizFinished(false);
    setScore(0);
    setTotalAnswered(0);
    if (mode === "quiz") setShowNotes(false);
  }

  function resetQuiz() {
    startQuiz();
  }

  const current = questions[questionIndex];

  function handleGuess(note: string) {
    if (!current || feedback) return;
    setSelected(note);
    setTotalAnswered((t) => t + 1);
    if (note === current.note) {
      setFeedback("correct");
      setScore((s) => s + 1);
    } else {
      setFeedback("incorrect");
    }
    setTimeout(() => {
      const next = questionIndex + 1;
      if (next >= questions.length) {
        setQuestionIndex(next);
        setQuizFinished(true);
      } else {
        setQuestionIndex(next);
        setSelected(null);
        setFeedback(null);
      }
    }, 1200);
  }

  const noteButtons = useMemo(() => NOTES, []);

  function handlePresetClick(index: number) {
    setActivePreset(index);
    setQuizStarted(false);
    setShowNotes(true);
    setCustomInput("");
  }

  function handleCustomInput(value: string) {
    setCustomInput(value);
    const parsed = parseFrets(value);
    setCustomFrets(parsed);
    setActivePreset("custom");
    setQuizStarted(false);
    setShowNotes(true);
  }

  const activeQuiz = quizStarted && current;

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-6xl px-4 pb-12 pt-20 space-y-4 sm:px-6 sm:pt-24">
        {/* Presets row */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p, i) => (
            <Button
              key={p.label}
              variant={i === activePreset ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetClick(i)}
            >
              {p.label}
            </Button>
          ))}
          <Button
            variant={activePreset === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (activePreset !== "custom") {
                setActivePreset("custom");
                setQuizStarted(false);
                setShowNotes(true);
              }
            }}
          >
            Custom
          </Button>
          {activePreset === "custom" && (
            <input
              type="text"
              placeholder="e.g. 0-5 or 0,3,5,7"
              value={customInput}
              onChange={(e) => handleCustomInput(e.target.value)}
              className="w-40 rounded-md border border-border bg-background px-2.5 py-1 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          )}
          {frets.length > 0 && activePreset === "custom" && (
            <span className="text-xs text-muted-foreground">
              {frets.length} fret{frets.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Mode + hide-notes row */}
        <div className="flex items-center gap-2">
          <Button
            variant={mode === "revise" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("revise");
              setQuizStarted(false);
              setShowNotes(true);
            }}
          >
            <BookOpen className="size-3.5 mr-1.5" />
            Revise
          </Button>
          <Button
            variant={mode === "quiz" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("quiz");
              setQuizStarted(false);
              setShowNotes(false);
            }}
          >
            <Play className="size-3.5 mr-1.5" />
            Quiz
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={mode === "quiz"}
            onClick={() => setShowNotes((v) => !v)}
          >
            {showNotes ? (
              <>
                <EyeOff className="size-3.5 mr-1.5" />
                Hide Notes
              </>
            ) : (
              <>
                <Eye className="size-3.5 mr-1.5" />
                Show Notes
              </>
            )}
          </Button>
        </div>

        {/* Active quiz */}
        {activeQuiz ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  {presetLabel}
                </span>
                {mode === "revise" && current
                  ? ` — Fret ${current.fret}, String ${6 - current.stringIndex}`
                  : ` — Question ${questionIndex + 1} of ${questions.length}`}
              </span>
              <span className="text-muted-foreground">
                Score: {score} / {totalAnswered}
              </span>
            </div>

            <Fretboard
              highlights={[
                { stringIndex: current.stringIndex, fret: current.fret },
              ]}
              showNotes={showNotes}
              highlightFrets={frets}
            />

            <div className="flex flex-col items-center gap-3">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {noteButtons.map((note) => {
                  const isSelected = selected === note;
                  const isCorrect = current.note === note;
                  let variant:
                    | "default"
                    | "outline"
                    | "secondary"
                    | "destructive" = "outline";
                  if (feedback) {
                    if (isCorrect) variant = "default";
                    else if (isSelected) variant = "destructive";
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
          </>
        ) : quizFinished ? (
          <>
            <Fretboard
              showNotes={mode === "revise" && showNotes}
              highlightFrets={frets}
            />
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-semibold">Complete!</h2>
                <p className="text-muted-foreground">{presetLabel}</p>
                <p className="text-muted-foreground">
                  You got {score} out of {totalAnswered} correct.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={resetQuiz}>
                  Retry
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* pre-quiz idle */
          <>
            <Fretboard showNotes={showNotes} highlightFrets={frets} />

            <div className="flex flex-col items-center gap-3 py-4">
              <p className="text-muted-foreground text-sm">
                {mode === "revise"
                  ? "Sweep strings 6→1 per fret. Toggle notes on/off as you go."
                  : "Notes are hidden. Answer 10 questions within"}{" "}
                <span className="font-medium text-foreground">
                  {presetLabel}
                </span>
                .
              </p>
              <Button onClick={startQuiz} disabled={frets.length === 0}>
                <Play className="size-4 mr-1.5" />
                Start {mode === "revise" ? "Revise" : "Quiz"}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
