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
import type { ReviewScope } from "@/lib/curriculum";
import { saveDayResult } from "@/lib/progress";

type LearnPhase = "sweep" | "quiz";

function resolveChords(chordGroup?: ChordGroupKey | ChordGroupKey[]) {
  if (!chordGroup) return [];
  const groups = Array.isArray(chordGroup) ? chordGroup : [chordGroup];
  return groups.flatMap((g) => CHORD_GROUP_MAP[g] ?? []);
}

function generateReviewQuestions(
  reviewScopes: ReviewScope[],
  questionCount: number,
) {
  const noteScopes = reviewScopes.filter((s) => s.type === "note");
  const chordScopes = reviewScopes.filter((s) => s.type === "chord");

  let noteQuestions: ReturnType<typeof generateQuestions> = [];
  let chordQuestions: { chord: ReturnType<typeof resolveChords>[number] }[] =
    [];

  for (const scope of noteScopes) {
    const n = Math.max(
      1,
      Math.round(
        (questionCount *
          (scope.frets?.length ?? 0) *
          (scope.stringFocus === "all" ? 6 : 3)) /
          estimateTotal(reviewScopes),
      ),
    );
    noteQuestions.push(
      ...generateQuestions(
        n,
        scope.frets ?? [],
        scope.stringFocus ?? "all",
        scope.noteFilter ?? "all",
      ),
    );
  }

  for (const scope of chordScopes) {
    const chords = (scope.chordGroups ?? []).flatMap(
      (g) => CHORD_GROUP_MAP[g] ?? [],
    );
    const n = Math.max(
      1,
      Math.round((questionCount * chords.length) / estimateTotal(reviewScopes)),
    );
    for (let i = 0; i < n; i++) {
      chordQuestions.push({
        chord: chords[Math.floor(Math.random() * chords.length)]!,
      });
    }
  }

  const combined: (
    | { type: "note"; q: ReturnType<typeof generateQuestions>[number] }
    | { type: "chord"; c: (typeof chordQuestions)[number] }
  )[] = [
    ...noteQuestions.map((q) => ({ type: "note" as const, q })),
    ...chordQuestions.map((c) => ({ type: "chord" as const, c })),
  ];

  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j]!, combined[i]!];
  }

  return combined.slice(0, questionCount);
}

function estimateTotal(scopes: ReviewScope[]) {
  let total = 0;
  for (const s of scopes) {
    if (s.type === "note") {
      const strings = s.stringFocus === "all" ? 6 : 3;
      total += (s.frets?.length ?? 0) * strings;
    } else {
      total += (s.chordGroups ?? []).reduce(
        (sum, g) => sum + (CHORD_GROUP_MAP[g]?.length ?? 0),
        0,
      );
    }
  }
  return total || 1;
}

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
  const isReview = lesson?.mode === "review";

  const [learnPhase, setLearnPhase] = useState<LearnPhase>("sweep");
  const [chordLearnPhase, setChordLearnPhase] = useState<LearnPhase>("sweep");

  const chordLevel = useMemo(() => {
    if (!lesson || (!isChord && !isReview)) return null;
    const chords = resolveChords(lesson.chordGroup);
    if (chords.length === 0 && lesson.reviewScopes?.length) {
      const reviewChords = lesson.reviewScopes
        .filter((s) => s.type === "chord")
        .flatMap((s) => (s.chordGroups ?? []).flatMap((g) => CHORD_GROUP_MAP[g] ?? []));
      return makeChordLevel(
        "course",
        lesson.title,
        lesson.description,
        reviewChords,
      );
    }
    if (chords.length === 0) return null;
    return makeChordLevel("course", lesson.title, lesson.description, chords);
  }, [lesson, isChord, isReview]);

  const [qs, setQs] = useState<ReturnType<typeof generateQuestions>>([]);
  const [reviewQs, setReviewQs] = useState<
    ReturnType<typeof generateReviewQuestions>
  >([]);

  useEffect(() => {
    if (!lesson) return;
    if (isReview && lesson.reviewScopes) {
      setReviewQs(
        generateReviewQuestions(lesson.reviewScopes, lesson.questionCount),
      );
      return;
    }
    if (isChord) return;
    if (isLearn && learnPhase === "sweep") {
      setQs(
        generateSweepQuestions(
          lesson.frets,
          lesson.stringFocus,
          lesson.noteFilter,
        ),
      );
    } else {
      setQs(
        generateQuestions(
          lesson.questionCount || 30,
          lesson.frets,
          lesson.stringFocus,
          lesson.noteFilter,
        ),
      );
    }
  }, [lesson, isLearn, isChord, isReview, learnPhase]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [finished, setFinished] = useState(false);

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

  function startLearnQuiz() {
    if (!lesson) return;
    setLearnPhase("quiz");
    setQs(
      generateQuestions(
        lesson.questionCount || 10,
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

  function complete() {
    saveDayResult(day);
    router.push("/course");
  }

  function reset() {
    if (!lesson) return;
    setLearnPhase("sweep");
    setChordLearnPhase("sweep");
    if (isReview && lesson.reviewScopes) {
      setReviewQs(
        generateReviewQuestions(lesson.reviewScopes, lesson.questionCount),
      );
      correctRef.current = 0;
      totalRef.current = 0;
      setQuestionIndex(0);
      setSelected(null);
      setFeedback(null);
      setFinished(false);
      return;
    }
    if (isChord) {
      correctRef.current = 0;
      totalRef.current = 0;
      return;
    }
    setQs(
      generateSweepQuestions(
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
    !isLearn || learnPhase === "quiz"
      ? totalRef.current > 0
        ? correctRef.current / totalRef.current >= lesson!.passThreshold
        : false
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

  if (isReview && lesson.reviewScopes) {
    const hasChords = lesson.reviewScopes.some((s) => s.type === "chord");
    const hasNotes = lesson.reviewScopes.some((s) => s.type === "note");
    const onlyChords = hasChords && !hasNotes;

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
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-medium">
                Review
              </span>
              <span className="text-sm text-muted-foreground">
                Day {day} &middot; {lesson.title}
              </span>
            </div>
            {!finished && (
              <span className="text-sm text-muted-foreground">
                {questionIndex} / {reviewQs.length}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {lesson.description}
          </p>

          {!finished && reviewQs.length > 0 && (
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 transition-all duration-300"
                style={{ width: `${(questionIndex / reviewQs.length) * 100}%` }}
              />
            </div>
          )}

          {finished ? (
            <div className="flex flex-col items-center gap-4 py-8">
              {passed ? (
                <>
                  <h2 className="text-2xl font-semibold">Passed!</h2>
                  <p className="text-muted-foreground">
                    {correctRef.current}/{totalRef.current} correct
                  </p>
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
                    {correctRef.current}/{totalRef.current} correct &mdash; need{" "}
                    {Math.round(lesson.passThreshold * 100)}%
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
          ) : onlyChords && chordLevel ? (
            <ReviewChordQuiz
              chordLevel={chordLevel}
              reviewQs={reviewQs}
              questionIndex={questionIndex}
              passThreshold={lesson.passThreshold}
              onComplete={complete}
              onBack={() => router.push("/course")}
              onQuestion={(correct) => {
                totalRef.current += 1;
                if (correct) correctRef.current += 1;
                const next = questionIndex + 1;
                if (next >= reviewQs.length) {
                  setQuestionIndex(next);
                  setFinished(true);
                } else {
                  setQuestionIndex(next);
                }
              }}
            />
          ) : (
            <ReviewMixedQuiz
              reviewQs={reviewQs}
              questionIndex={questionIndex}
              chordLevel={chordLevel}
              lesson={lesson}
              onComplete={complete}
              onBack={() => router.push("/course")}
              onQuestion={(correct) => {
                totalRef.current += 1;
                if (correct) correctRef.current += 1;
                const next = questionIndex + 1;
                if (next >= reviewQs.length) {
                  setQuestionIndex(next);
                  setFinished(true);
                } else {
                  setQuestionIndex(next);
                }
              }}
            />
          )}
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
            <div className="flex items-center gap-2">
              {chordLearnPhase === "sweep" && isLearn && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-medium">
                  Learn
                </span>
              )}
              <div className="text-sm text-muted-foreground">
                Day {day} &middot; {lesson.title}
              </div>
            </div>
            {chordLearnPhase === "quiz" && !finished && (
              <span className="text-sm text-muted-foreground">
                {questionIndex + 1} / {qs.length}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {lesson.description}
          </p>

          {isLearn && chordLearnPhase === "sweep" ? (
            <>
              {!finished && qs.length > 0 && (
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${(questionIndex / qs.length) * 100}%` }}
                  />
                </div>
              )}
              <ChordLearn
                chords={chordLevel.chords ?? []}
                title={lesson.title}
              />
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => {
                    setChordLearnPhase("quiz");
                    setQs(
                      generateQuestions(
                        lesson.questionCount || 10,
                        [],
                        "all",
                        "all",
                      ),
                    );
                    correctRef.current = 0;
                    totalRef.current = 0;
                  }}
                >
                  Start Quiz
                </Button>
              </div>
            </>
          ) : isLearn && chordLearnPhase === "quiz" ? (
            <ChordQuiz
              level={chordLevel}
              mode="course"
              passThreshold={lesson.passThreshold}
              onComplete={complete}
              onBack={() => router.push("/course")}
            />
          ) : lesson.mode === "quiz" ? (
            <ChordQuiz
              level={chordLevel}
              mode="course"
              passThreshold={lesson.passThreshold}
              onComplete={complete}
              onBack={() => router.push("/course")}
            />
          ) : null}
        </main>
      </div>
    );
  }

  const isLearnSweep = isLearn && learnPhase === "sweep";

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
          <div className="flex items-center gap-2">
            {isLearnSweep && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-medium">
                Learn
              </span>
            )}
            {isLearn && learnPhase === "quiz" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-medium">
                Quiz
              </span>
            )}
            <div className="text-sm text-muted-foreground">
              Day {day} · {lesson.title}
            </div>
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
              className={`h-full transition-all duration-300 ${isLearnSweep ? "bg-sky-500" : "bg-primary"}`}
              style={{ width: `${(questionIndex / qs.length) * 100}%` }}
            />
          </div>
        )}

        {finished ? (
          <>
            <Fretboard
              showNotes={true}
              showStringNames={isLearnSweep}
              highlightFrets={lesson.frets}
            />
            <div className="flex flex-col items-center gap-4 py-8">
              {isLearnSweep ? (
                <>
                  <h2 className="text-2xl font-semibold">Sweep Complete</h2>
                  <p className="text-muted-foreground">
                    {qs.length} positions reviewed
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={reset}>
                      Retry Sweep
                    </Button>
                    <Button onClick={startLearnQuiz}>Take Quiz</Button>
                  </div>
                </>
              ) : passed ? (
                <>
                  <h2 className="text-2xl font-semibold">Passed!</h2>
                  <p className="text-muted-foreground">
                    {correctRef.current}/{totalRef.current} correct
                  </p>
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
                    {correctRef.current}/{totalRef.current} correct &mdash; need{" "}
                    {Math.round(lesson.passThreshold * 100)}%
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
              showNotes={isLearnSweep}
              showStringNames={isLearnSweep}
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

function ReviewChordQuiz({
  chordLevel,
  reviewQs,
  questionIndex,
  passThreshold,
  onComplete,
  onBack,
  onQuestion,
}: {
  chordLevel: NonNullable<ReturnType<typeof makeChordLevel>>;
  reviewQs: ReturnType<typeof generateReviewQuestions>;
  questionIndex: number;
  passThreshold: number;
  onComplete: () => void;
  onBack: () => void;
  onQuestion: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [localIndex, setLocalIndex] = useState(0);

  useEffect(() => {
    setLocalIndex(questionIndex);
    setSelected(null);
    setFeedback(null);
  }, [questionIndex]);

  const raw = reviewQs[localIndex];
  if (!raw || raw.type !== "chord") return null;
  const current = raw;
  const allChords = chordLevel.chords ?? [];

  function handleGuess(name: string) {
    if (feedback) return;
    setSelected(name);
    const correct = name === current.c.chord.name;
    setFeedback(correct ? "correct" : "incorrect");
    setTimeout(() => {
      onQuestion(correct);
    }, 1000);
  }

  const options = useMemo(() => {
    const correct = current.c.chord;
    const others = allChords
      .filter((c) => c.slug !== correct.slug)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [correct.name, ...others.map((c) => c.name)].sort(
      () => Math.random() - 0.5,
    );
  }, [current, allChords]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Which chord is this?
        </p>
      </div>
      <div className="rounded-xl border bg-card/60 p-4">
        <Fretboard
          highlights={current.c.chord.positions}
          showNotes={false}
          muted={current.c.chord.muted}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((name) => (
          <Button
            key={name}
            variant={
              feedback
                ? name === current.c.chord.name
                  ? "default"
                  : name === selected
                    ? "destructive"
                    : "outline"
                : "outline"
            }
            onClick={() => handleGuess(name)}
            disabled={!!feedback}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ReviewMixedQuiz({
  reviewQs,
  questionIndex,
  chordLevel,
  lesson,
  onComplete,
  onBack,
  onQuestion,
}: {
  reviewQs: ReturnType<typeof generateReviewQuestions>;
  questionIndex: number;
  chordLevel: ReturnType<typeof makeChordLevel> | null;
  lesson: NonNullable<(typeof ALL_LESSONS)[number]>;
  onComplete: () => void;
  onBack: () => void;
  onQuestion: (correct: boolean) => void;
}) {
  const noteButtons = useMemo(() => NOTES, []);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [localIndex, setLocalIndex] = useState(0);

  useEffect(() => {
    setLocalIndex(questionIndex);
    setSelected(null);
    setFeedback(null);
  }, [questionIndex]);

  const raw = reviewQs[localIndex];
  if (!raw) return null;
  const current = raw;

  if (current.type === "note") {
    const noteQ = current.q;
    const noteCurrent = current;

    function handleGuess(note: string) {
      if (feedback) return;
      setSelected(note);
      const correct = note === noteCurrent.q.note;
      setFeedback(correct ? "correct" : "incorrect");
      setTimeout(() => {
        onQuestion(correct);
      }, 800);
    }

    return (
      <>
        <Fretboard
          highlights={[
            { stringIndex: noteCurrent.q.stringIndex, fret: noteCurrent.q.fret },
          ]}
          showNotes={false}
          showStringNames={false}
          highlightFrets={lesson.frets}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {noteButtons.map((note) => {
              const isSelected = selected === note;
              const isCorrect = noteQ.note === note;
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
                : `Incorrect — it was ${noteQ.note}`}
            </div>
          )}
        </div>
      </>
    );
  }

  if (current.type === "chord" && chordLevel) {
    const chordCurrent = current;
    const allChords = chordLevel.chords ?? [];
    const options = useMemo(() => {
      const correct = chordCurrent.c.chord;
      const others = allChords
        .filter((c) => c.slug !== correct.slug)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      return [correct.name, ...others.map((c) => c.name)].sort(
        () => Math.random() - 0.5,
      );
    }, [current, allChords]);

    function handleGuess(name: string) {
      if (feedback) return;
      setSelected(name);
      const correct = name === chordCurrent.c.chord.name;
      setFeedback(correct ? "correct" : "incorrect");
      setTimeout(() => {
        onQuestion(correct);
      }, 1000);
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Which chord is this?</p>
        </div>
        <div className="rounded-xl border bg-card/60 p-4">
          <Fretboard
            highlights={chordCurrent.c.chord.positions}
            showNotes={false}
            muted={chordCurrent.c.chord.muted}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {options.map((name) => (
            <Button
              key={name}
              variant={
                feedback
                  ? name === chordCurrent.c.chord.name
                    ? "default"
                    : name === selected
                      ? "destructive"
                      : "outline"
                  : "outline"
              }
              onClick={() => handleGuess(name)}
              disabled={!!feedback}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
