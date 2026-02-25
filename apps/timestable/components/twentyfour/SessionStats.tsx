"use client";

import Timer from "@/components/Timer";
import Progress from "@/components/Progress";

export default function SessionStats({
  dealIndex,
  totalDeals,
  completedDeals,
  startSignal,
  stopSignal,
  resetSignal,
}: {
  dealIndex: number;
  totalDeals: number;
  completedDeals: number;
  startSignal: number;
  stopSignal: number;
  resetSignal: number;
}) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex items-center justify-between text-sm text-zinc-700 dark:text-zinc-300">
        <span>
          Deal {Math.min(dealIndex + 1, totalDeals)} / {totalDeals}
        </span>
        <Timer
          startSignal={startSignal}
          stopSignal={stopSignal}
          resetSignal={resetSignal}
        />
      </div>
      <Progress total={totalDeals} filled={completedDeals} />
    </div>
  );
}
