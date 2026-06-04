import { ALL_LESSONS } from "./curriculum";

const STORAGE_KEY = "guitar-course-progress";

export interface DayResult {
  day: number;
  score: number;
  total: number;
  completedAt: string;
}

export function loadProgress(): DayResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DayResult[];
  } catch {
    return [];
  }
}

export function saveDayResult(result: DayResult): void {
  const progress = loadProgress();
  const idx = progress.findIndex((r) => r.day === result.day);
  if (idx >= 0) {
    progress[idx] = result;
  } else {
    progress.push(result);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getDayResult(day: number): DayResult | undefined {
  return loadProgress().find((r) => r.day === day);
}

export function isDayUnlocked(day: number): boolean {
  return isDayUnlockedWithProgress(day, loadProgress());
}

export function isDayUnlockedWithProgress(day: number, progress: DayResult[]): boolean {
  if (day === 1) return true;

  const lesson = ALL_LESSONS.find((l) => l.day === day);
  if (!lesson) return false;

  const prev = progress.find((r) => r.day === day - 1);
  if (!prev) return false;

  const prevLesson = ALL_LESSONS.find((l) => l.day === day - 1);
  if (!prevLesson) return false;

  const passed = prevLesson.passThreshold === 0
    ? true
    : prev.total > 0 && prev.score / prev.total >= prevLesson.passThreshold;

  return passed;
}

export function getNextUnlockedDay(): number | null {
  for (let d = 1; d <= ALL_LESSONS.length; d++) {
    if (!getDayResult(d)) {
      return isDayUnlocked(d) ? d : null;
    }
  }
  return null; // all complete
}

export function getSectionProgress(
  startDay: number,
  endDay: number,
): { completed: number; total: number } {
  let completed = 0;
  const total = endDay - startDay + 1;
  for (let d = startDay; d <= endDay; d++) {
    if (getDayResult(d)) completed++;
  }
  return { completed, total };
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
