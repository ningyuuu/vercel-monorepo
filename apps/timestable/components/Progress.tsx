"use client";
import React from "react";

export default function Progress({
  total = 20,
  filled = 0,
}: {
  total?: number;
  filled?: number;
}) {
  const pct = Math.max(
    0,
    Math.min(100, Math.round((filled / Math.max(1, total)) * 100)),
  );
  return (
    <div className="mt-3 px-1">
      <div className="w-full rounded bg-zinc-200 dark:bg-zinc-700 h-4 overflow-hidden">
        <div
          className="h-4 bg-emerald-500 transition-all duration-200"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
      <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
        {filled} / {total} completed
      </div>
    </div>
  );
}
