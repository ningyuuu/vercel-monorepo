"use client";

import {
  useSummaryTaskState,
  formatTaskStatus,
} from "@/app/hooks/useSummaryTaskState";

type Props = { taskId: string };

function getSummaryText(result?: Record<string, unknown> | null) {
  const summary = result?.result;

  return typeof summary === "string" ? summary : null;
}

export function DocumentResultView({ taskId }: Props) {
  const summaryTask = useSummaryTaskState(taskId);

  const summaryText = getSummaryText(summaryTask.result);

  return (
    <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium">
          {summaryTask.status
            ? `Task status: ${formatTaskStatus(summaryTask.status)}`
            : "Task status: Starting"}
        </p>
        <p className="text-xs text-muted-foreground">
          Task ID: {summaryTask.taskId}
        </p>
      </div>
      {summaryTask.message ? (
        <p className="mt-1 text-sm text-muted-foreground">
          {summaryTask.message}
        </p>
      ) : null}
      {summaryTask.phase === "error" ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {summaryTask.message}
        </p>
      ) : null}
      {summaryTask.phase === "success" && summaryText ? (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium">Summary</p>
          <p className="whitespace-pre-wrap text-sm text-foreground">
            {summaryText}
          </p>
        </div>
      ) : null}
    </div>
  );
}
