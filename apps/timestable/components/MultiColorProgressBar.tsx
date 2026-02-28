"use client";

type ProgressOwner = 1 | 2 | null;

export default function MultiColorProgressBar({
  total,
  segments,
}: {
  total: number;
  segments: ProgressOwner[];
}) {
  const safeTotal = Math.max(1, total);
  const filled = Math.min(segments.length, safeTotal);

  return (
    <div className="mt-3 px-1">
      <div className="flex h-4 w-full overflow-hidden rounded bg-zinc-200 dark:bg-zinc-700">
        {Array.from({ length: safeTotal }, (_, index) => {
          const owner = segments[index] ?? null;
          const colorClass =
            owner === 1
              ? "bg-emerald-500"
              : owner === 2
                ? "bg-rose-500"
                : "bg-zinc-300 dark:bg-zinc-600";

          return (
            <div
              key={index}
              className={`h-full flex-1 ${colorClass} transition-colors duration-200`}
              aria-hidden
            />
          );
        })}
      </div>
      <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
        {filled} / {safeTotal} completed
      </div>
    </div>
  );
}
