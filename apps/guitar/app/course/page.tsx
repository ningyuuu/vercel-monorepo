"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock, GraduationCap } from "lucide-react";
import { DayTooltip } from "../components/DayTooltip";
import { ALL_LESSONS, SECTIONS } from "@/lib/curriculum";
import { loadProgress, isDayUnlocked } from "@/lib/progress";

export default function CoursePage() {
  const router = useRouter();
  const [lastCompleted, setLastCompleted] = useState(0);

  useEffect(() => {
    setLastCompleted(loadProgress());
  }, []);

  function isCompleted(day: number) {
    return day <= lastCompleted;
  }

  function isUnlocked(day: number) {
    return isDayUnlocked(day, lastCompleted);
  }

  const completedCount = Math.min(lastCompleted, ALL_LESSONS.length);

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
            {completedCount} of {ALL_LESSONS.length} days completed
          </p>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${(completedCount / ALL_LESSONS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => {
          const completed = section.days.filter((l) =>
            isCompleted(l.day),
          ).length;
          const total = section.days.length;
          const firstDay = section.days[0]!.day;
          const sectionUnlocked = isUnlocked(firstDay);

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
                  const completed = isCompleted(lesson.day);
                  const unlocked = isUnlocked(lesson.day);

                  const extra = completed
                    ? "Completed"
                    : !unlocked
                      ? `Complete day ${lastCompleted} to unlock`
                      : "";

                  return (
                    <DayTooltip
                      key={lesson.day}
                      title={lesson.title}
                      description={lesson.description}
                      extra={extra}
                    >
                      <span>
                        <button
                          disabled={!unlocked}
                          onClick={() => router.push(`/course/${lesson.day}`)}
                          className={`
                        relative flex items-center justify-center
                        w-9 h-9 rounded-full text-xs font-medium
                        transition-all duration-200
                        ${
                          completed
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 cursor-pointer"
                            : unlocked
                              ? "border-2 border-primary text-primary bg-primary/5 hover:bg-primary/10 cursor-pointer"
                              : "bg-muted text-muted-foreground/50 cursor-not-allowed"
                        }
                      `}
                        >
                          {completed ? (
                            <Check className="size-3.5" />
                          ) : !unlocked ? (
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
