import React from "react";

export default function Timestable(): React.ReactElement {
  const size = 9;
  const rows = Array.from({ length: size }, (_, i) => i + 1);
  const cols = Array.from({ length: size }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-4xl px-6">
      <div className="grid grid-cols-9 gap-1 rounded-lg bg-zinc-200 p-1 dark:bg-zinc-800">
        {rows.map((r) =>
          cols.map((c) => {
            const val = r * c;
            return (
              <div
                key={`${r}x${c}`}
                className="flex items-center justify-center h-14 bg-white text-2xl font-medium text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50"
              >
                {val}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
