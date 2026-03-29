"use client";

import { useEffect, useState } from "react";

import {
  type SummaryTaskDetailResponse,
  type SummaryTaskStatus,
} from "@/lib/summarise-doc";

const TASK_POLL_INTERVAL_MS = 1500;

export type SummaryTaskState = {
  phase: "idle" | "polling" | "success" | "error";
  taskId: string;
  status?: SummaryTaskStatus;
  message?: string;
  result?: Record<string, unknown> | null;
};

type SummaryTaskErrorResponse = {
  error?: string;
};

function formatTaskMessage(status: SummaryTaskStatus) {
  switch (status) {
    case "queued":
      return "The extract-data task is queued.";
    case "in_progress":
      return "The document is being processed.";
    case "completed":
      return "Extraction complete.";
    case "failed":
      return "Extraction failed.";
    default:
      return "Processing extract-data task.";
  }
}

function isSummaryTaskDetailResponse(
  value: SummaryTaskDetailResponse | SummaryTaskErrorResponse,
): value is SummaryTaskDetailResponse {
  return "task_id" in value && "status" in value;
}

async function fetchSummaryTask(taskId: string) {
  const response = await fetch(
    `/api/tasks/summarise_doc/${encodeURIComponent(taskId)}`,
    {
      cache: "no-store",
    },
  );
  const data = (await response.json()) as
    | SummaryTaskDetailResponse
    | SummaryTaskErrorResponse;

  return {
    ok: response.ok,
    data,
  };
}

export function useSummaryTaskState(taskId: string) {
  const [summaryTask, setSummaryTask] = useState<SummaryTaskState>({
    phase: "polling",
    taskId,
    message: "Loading task status...",
  });

  const isPolling =
    summaryTask.phase === "polling" &&
    Boolean(summaryTask.taskId) &&
    !["completed", "failed"].includes(summaryTask.status ?? "");

  // set up an effect to poll task status
  useEffect(() => {
    if (!isPolling || !summaryTask.taskId) {
      return;
    }

    let cancelled = false;
    const nextTaskId = summaryTask.taskId;
    const timer = window.setTimeout(() => {
      async function pollTask() {
        try {
          const { ok, data } = await fetchSummaryTask(nextTaskId);

          if (cancelled) {
            return;
          }

          if (!ok || !isSummaryTaskDetailResponse(data)) {
            setSummaryTask({
              phase: "error",
              taskId: nextTaskId,
              message: data.error || "Unable to retrieve task status.",
            });
            return;
          }

          if (data.status === "completed") {
            setSummaryTask({
              phase: "success",
              taskId: data.task_id,
              status: data.status,
              message: formatTaskMessage(data.status),
              result: data.result,
            });
            return;
          }

          if (data.status === "failed") {
            setSummaryTask({
              phase: "error",
              taskId: data.task_id,
              status: data.status,
              message: data.error || formatTaskMessage(data.status),
              result: data.result,
            });
            return;
          }

          setSummaryTask({
            phase: "polling",
            taskId: data.task_id,
            status: data.status,
            message: formatTaskMessage(data.status),
            result: data.result,
          });
        } catch {
          if (cancelled) {
            return;
          }

          setSummaryTask({
            phase: "error",
            taskId: nextTaskId,
            message: "Unable to retrieve task status.",
          });
        }
      }

      void pollTask();
    }, TASK_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isPolling, summaryTask.taskId, summaryTask.status]);

  return summaryTask;
}

export function formatTaskStatus(status: SummaryTaskStatus) {
  switch (status) {
    case "queued":
      return "Queued";
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}
