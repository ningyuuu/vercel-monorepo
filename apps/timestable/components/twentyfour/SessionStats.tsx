"use client";

import Timer, { type TimerState } from "@/components/Timer";
import Progress from "@/components/Progress";

export default function SessionStats({
  dealIndex,
  totalDeals,
  completedDeals,
  timerState,
}: {
  dealIndex: number;
  totalDeals: number;
  completedDeals: number;
  timerState: TimerState;
}) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex items-center justify-between text-sm text-zinc-700 dark:text-zinc-300">
        <span>
          Deal {Math.min(dealIndex + 1, totalDeals)} / {totalDeals}
        </span>
        <Timer timerState={timerState} />
      </div>
      <Progress total={totalDeals} filled={completedDeals} />
    </div>
  );
}
