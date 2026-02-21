import React from "react";

export default function Timestable({
  completed,
  size = 9,
}: {
  completed: string[];
  size?: number;
}): React.ReactElement {
  const rows = Array.from({ length: size }, (_, i) => i + 1);
  const cols = Array.from({ length: size }, (_, i) => i + 1);

  const isCompleteStyle = "bg-green-200 dark:bg-green-700";
  const defaultStyle = "bg-white dark:bg-zinc-900";

  return (
    <div className="w-full max-w-4xl px-3 sm:px-6">
      <div className="grid grid-cols-9 gap-1 rounded-lg bg-zinc-200 p-1 dark:bg-zinc-800">
        {rows.map((r) =>
          cols.map((c) => {
            const val = r * c;
            const key = `${r}x${c}`;
            const isCompleted = completed?.includes(key);

            return (
              <div
                key={key}
                className={`flex items-center justify-center h-10 sm:h-16 text-base sm:text-2xl font-medium text-zinc-900 dark:text-zinc-50 ${
                  isCompleted ? isCompleteStyle : defaultStyle
                }`}
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
