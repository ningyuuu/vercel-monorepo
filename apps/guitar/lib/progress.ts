const STORAGE_KEY = "guitar-course-progress";

export function loadProgress(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    // Support migration from old array format
    if (Array.isArray(parsed)) {
      const days = parsed.map((r: Record<string, unknown>) => r.day as number);
      return days.length > 0 ? Math.max(...days) : 0;
    }
    return typeof parsed === "number" ? parsed : 0;
  } catch {
    return 0;
  }
}

export function saveDayResult(day: number): void {
  const current = loadProgress();
  if (day > current) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(day));
  }
}

export function isDayUnlocked(day: number, lastCompleted: number): boolean {
  return day <= lastCompleted + 1;
}
