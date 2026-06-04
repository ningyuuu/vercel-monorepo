"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock, GraduationCap } from "lucide-react";
import { DayTooltip } from "../components/DayTooltip";
import { ALL_LESSONS, SECTIONS } from "@/lib/curriculum";
import {
  loadProgress,
  getDayResult,
  isDayUnlockedWithProgress,
} from "@/lib/progress";

export default function CoursePage() {
  const router = useRouter();
  const [progress, setProgress] = useState<ReturnType<typeof loadProgress>>([]);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const dayResults = useMemo(() => {
    const map = new Map<number, ReturnType<typeof getDayResult>>();
    for (const r of progress) {
      map.set(r.day, r);
    }
    return map;
  }, [progress]);

  function dayStatus(
    day: number,
  ): "completed" | "failed" | "available" | "locked" {
    const result = dayResults.get(day);
    if (result) {
      const lesson = ALL_LESSONS.find((l) => l.day === day);
      if (!lesson) return "locked";
      const passed =
        lesson.passThreshold === 0 ||
        result.score / result.total >= lesson.passThreshold;
      return passed ? "completed" : "failed";
    }
    return isDayUnlockedWithProgress(day, progress) ? "available" : "locked";
  }

  const completedDays = ALL_LESSONS.filter((l) => dayResults.has(l.day)).length;

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-5xl px-4 pb-12 pt-20 space-y-8 sm:px-6 sm:pt-24">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-6 text-primary" />
            <h1 className="text-2xl font-heading tracking-tight">Course</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {completedDays} of {ALL_LESSONS.length} days completed
          </p>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${(completedDays / ALL_LESSONS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => {
          const { completed, total } = (() => {
            let c = 0;
            for (const l of section.days) {
              if (dayResults.has(l.day)) c++;
            }
            return { completed: c, total: section.days.length };
          })();
          const firstDay = section.days[0]!.day;
          const sectionUnlocked = isDayUnlockedWithProgress(firstDay, progress);

          return (
            <div
              key={section.id}
              className={`rounded-xl border p-4 sm:p-5 ${
                sectionUnlocked
                  ? "border-border bg-card"
                  : "border-border/50 bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="font-heading text-lg">{section.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    {section.subtitle}
                  </p>
                </div>
                {sectionUnlocked ? (
                  <span className="text-xs text-muted-foreground font-medium">
                    {completed}/{total}
                  </span>
                ) : (
                  <Lock className="size-4 text-muted-foreground" />
                )}
              </div>

              {sectionUnlocked && (
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-primary/60 rounded-full transition-all duration-500"
                    style={{ width: `${(completed / total) * 100}%` }}
                  />
                </div>
              )}

              {/* Day pills */}
              <div className="flex flex-wrap gap-2">
                {section.days.map((lesson) => {
                  const status = dayStatus(lesson.day);
                  const canStart = status !== "locked";
                  const lastScore = dayResults.get(lesson.day);

                  let extra = "";
                  if (lastScore && lesson.mode === "quiz") {
                    extra = `Best: ${lastScore.score}/${lastScore.total} (${Math.round((lastScore.score / lastScore.total) * 100)}%)`;
                  } else if (lastScore && lesson.mode === "learn") {
                    extra = "Reviewed";
                  } else if (status === "locked") {
                    extra = "Complete previous day to unlock";
                  }

                  return (
                    <DayTooltip
                      key={lesson.day}
                      title={lesson.title}
                      description={lesson.description}
                      extra={extra}
                    >
                      <span>
                        <button
                          disabled={!canStart}
                          onClick={() => router.push(`/course/${lesson.day}`)}
                          className={`
                        relative flex items-center justify-center
                        w-9 h-9 rounded-full text-xs font-medium
                        transition-all duration-200
                        ${
                          status === "completed"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 cursor-pointer"
                            : status === "failed"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 cursor-pointer"
                              : status === "available"
                                ? "border-2 border-primary text-primary bg-primary/5 hover:bg-primary/10 cursor-pointer"
                                : "bg-muted text-muted-foreground/50 cursor-not-allowed"
                        }
                      `}
                        >
                          {status === "completed" ? (
                            <Check className="size-3.5" />
                          ) : status === "locked" ? (
                            <Lock className="size-3" />
                          ) : (
                            lesson.day
                          )}
                        </button>
                      </span>
                    </DayTooltip>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
