"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { ArrowLeft } from "lucide-react";
import { Fretboard, NOTES } from "../../components/Fretboard";
import ChordQuiz from "../../components/ChordQuiz";
import { ChordLearn } from "../../components/ChordLearn";
import { makeChordLevel } from "../../components/levels";
import { CHORD_GROUP_MAP } from "../../components/chords";
import type { ChordGroupKey } from "../../components/chords";
import { generateQuestions, generateSweepQuestions } from "@/lib/questions";
import { ALL_LESSONS } from "@/lib/curriculum";
import { saveDayResult } from "@/lib/progress";

export default function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day: dayParam } = use(params);
  const day = Number(dayParam);
  const router = useRouter();

  const lesson = ALL_LESSONS.find((l) => l.day === day);
  const isChord = lesson?.contentType === "chord";
  const isLearn = lesson?.mode === "learn";

  const chordLevel = useMemo(() => {
    if (!lesson || !isChord || !lesson.chordGroup) return null;
    const groups = Array.isArray(lesson.chordGroup)
      ? lesson.chordGroup
      : [lesson.chordGroup];
    const chords = groups.flatMap((g) => CHORD_GROUP_MAP[g] ?? []);
    return makeChordLevel("course", lesson.title, lesson.description, chords);
  }, [lesson, isChord]);

  const [qs, setQs] = useState<ReturnType<typeof generateQuestions>>([]);

  useEffect(() => {
    if (!lesson) return;
    setQs(
      isLearn
        ? generateSweepQuestions(
            lesson.frets,
            lesson.stringFocus,
            lesson.noteFilter,
          )
        : generateQuestions(
            lesson.questionCount || 30,
            lesson.frets,
            lesson.stringFocus,
            lesson.noteFilter,
          ),
    );
  }, [lesson, isLearn]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [finished, setFinished] = useState(false);

  // Score tracked in memory only — not persisted
  const correctRef = useRef(0);
  const totalRef = useRef(0);

  const current = qs[questionIndex];
  const noteButtons = useMemo(() => NOTES, []);

  function handleGuess(note: string) {
    if (!current || feedback) return;
    setSelected(note);
    totalRef.current += 1;
    const isCorrect = note === current.note;
    if (isCorrect) correctRef.current += 1;
    setFeedback(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      const next = questionIndex + 1;
      if (next >= qs.length) {
        setQuestionIndex(next);
        setFinished(true);
      } else {
        setQuestionIndex(next);
        setSelected(null);
        setFeedback(null);
      }
    }, 800);
  }

  function complete() {
    saveDayResult(day);
    router.push("/course");
  }

  function reset() {
    if (!lesson) return;
    setQs(
      isLearn
        ? generateSweepQuestions(
            lesson.frets,
            lesson.stringFocus,
            lesson.noteFilter,
          )
        : generateQuestions(
            lesson.questionCount || 30,
            lesson.frets,
            lesson.stringFocus,
            lesson.noteFilter,
          ),
    );
    correctRef.current = 0;
    totalRef.current = 0;
    setQuestionIndex(0);
    setSelected(null);
    setFeedback(null);
    setFinished(false);
  }

  const passed =
    !isLearn && totalRef.current > 0
      ? correctRef.current / totalRef.current >= lesson!.passThreshold
      : true;

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-start justify-center bg-background font-sans">
        <main className="w-full max-w-3xl px-4 pb-12 pt-20 space-y-4 sm:px-6 sm:pt-24">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/course")}
          >
            <ArrowLeft className="size-4 mr-1.5" />
            Back
          </Button>
          <p className="text-center text-muted-foreground">
            Day {day} not found.
          </p>
        </main>
      </div>
    );
  }

  if (isChord && chordLevel) {
    return (
      <div className="flex min-h-screen items-start justify-center bg-background font-sans">
        <main className="w-full max-w-3xl px-4 pb-12 pt-20 space-y-4 sm:px-6 sm:pt-24">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/course")}
            >
              <ArrowLeft className="size-4 mr-1.5" />
              Back
            </Button>
            <div className="text-sm text-muted-foreground">
              Day {day} &middot; {lesson.title}
            </div>
            <div />
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {lesson.description}
          </p>

          {lesson.mode === "quiz" ? (
            <ChordQuiz
              level={chordLevel}
              mode="course"
              passThreshold={lesson.passThreshold}
              onComplete={complete}
              onBack={() => router.push("/course")}
            />
          ) : lesson.mode === "learn" ? (
            <>
              <ChordLearn
                chords={chordLevel.chords ?? []}
                title={lesson.title}
              />
              <div className="flex justify-center pt-4">
                <Button onClick={complete}>Complete</Button>
              </div>
            </>
          ) : null}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-3xl px-4 pb-12 pt-20 space-y-4 sm:px-6 sm:pt-24">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/course")}
          >
            <ArrowLeft className="size-4 mr-1.5" />
            Back
          </Button>
          <div className="text-sm text-muted-foreground">
            Day {day} · {lesson.title}
          </div>
          {!finished && (
            <span className="text-sm text-muted-foreground">
              {questionIndex} / {qs.length}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground text-center">
          {lesson.description}
        </p>

        {/* Progress bar */}
        {!finished && qs.length > 0 && (
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(questionIndex / qs.length) * 100}%` }}
            />
          </div>
        )}

        {finished ? (
          <>
            <Fretboard
              showNotes={true}
              showStringNames={isLearn}
              highlightFrets={lesson.frets}
            />
            <div className="flex flex-col items-center gap-4 py-8">
              {isLearn ? (
                <>
                  <h2 className="text-2xl font-semibold">Done!</h2>
                  <p className="text-muted-foreground">
                    {qs.length} positions reviewed
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={reset}>
                      Retry
                    </Button>
                    <Button onClick={complete}>Complete</Button>
                  </div>
                </>
              ) : passed ? (
                <>
                  <h2 className="text-2xl font-semibold">Passed!</h2>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={reset}>
                      Retry
                    </Button>
                    <Button onClick={complete}>Complete</Button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">Keep Trying</h2>
                  <p className="text-muted-foreground">
                    Need {Math.round(lesson.passThreshold * 100)}% to pass
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={reset}>
                      Retry
                    </Button>
                    <Button onClick={() => router.push("/course")}>
                      Back to Course
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : current ? (
          <>
            <Fretboard
              highlights={[
                { stringIndex: current.stringIndex, fret: current.fret },
              ]}
              showNotes={isLearn}
              showStringNames={isLearn}
              highlightFrets={lesson.frets}
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
        ) : (
          <div className="flex flex-col items-center gap-4 py-12">
            <p className="text-muted-foreground">
              No positions available for this lesson.
            </p>
            <Button onClick={() => router.push("/course")}>Back</Button>
          </div>
        )}
      </main>
    </div>
  );
}
