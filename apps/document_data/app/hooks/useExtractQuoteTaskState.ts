"use client";

import { useEffect, useState } from "react";

import {
  type ExtractQuoteTaskDetailResponse,
  type ExtractQuoteTaskStatus,
} from "@/lib/extract-quote";

const TASK_POLL_INTERVAL_MS = 5000;

export type ExtractQuoteTaskState = {
  phase: "idle" | "polling" | "success" | "error";
  taskId: string;
  status?: ExtractQuoteTaskStatus;
  message?: string;
  result?: Record<string, unknown> | null;
};

type ExtractQuoteTaskErrorResponse = {
  error?: string;
};

function formatExtractQuoteTaskMessage(status: ExtractQuoteTaskStatus) {
  switch (status) {
    case "queued":
      return "The extract quote task is queued.";
    case "in_progress":
      return "The document is being processed.";
    case "completed":
      return "Quote extraction complete.";
    case "failed":
      return "Quote extraction failed.";
    default:
      return "Processing extract quote task.";
  }
}

function isExtractQuoteTaskDetailResponse(
  value: ExtractQuoteTaskDetailResponse | ExtractQuoteTaskErrorResponse,
): value is ExtractQuoteTaskDetailResponse {
  return "task_id" in value && "status" in value;
}

async function fetchExtractQuoteTask(taskId: string) {
  const response = await fetch(
    `/api/tasks/extract_quote/${encodeURIComponent(taskId)}`,
    {
      cache: "no-store",
    },
  );
  const data = (await response.json()) as
    | ExtractQuoteTaskDetailResponse
    | ExtractQuoteTaskErrorResponse;

  return {
    ok: response.ok,
    data,
  };
}

export function useExtractQuoteTaskState(taskId: string) {
  const [extractQuoteTask, setExtractQuoteTask] =
    useState<ExtractQuoteTaskState>({
      phase: "polling",
      taskId,
      message: "Loading task status...",
    });

  const isPolling =
    extractQuoteTask.phase === "polling" &&
    Boolean(extractQuoteTask.taskId) &&
    !["completed", "failed"].includes(extractQuoteTask.status ?? "");

  useEffect(() => {
    if (!isPolling || !extractQuoteTask.taskId) {
      return;
    }

    let cancelled = false;
    const nextTaskId = extractQuoteTask.taskId;

    async function pollTask() {
      try {
        const { ok, data } = await fetchExtractQuoteTask(nextTaskId);

        if (cancelled) {
          return;
        }

        if (!ok || !isExtractQuoteTaskDetailResponse(data)) {
          setExtractQuoteTask({
            phase: "error",
            taskId: nextTaskId,
            message: data.error || "Unable to retrieve task status.",
          });
          return;
        }

        if (data.status === "completed") {
          setExtractQuoteTask({
            phase: "success",
            taskId: data.task_id,
            status: data.status,
            message: formatExtractQuoteTaskMessage(data.status),
            result: data.result,
          });
          return;
        }

        if (data.status === "failed") {
          setExtractQuoteTask({
            phase: "error",
            taskId: data.task_id,
            status: data.status,
            message: data.error || formatExtractQuoteTaskMessage(data.status),
            result: data.result,
          });
          return;
        }

        setExtractQuoteTask({
          phase: "polling",
          taskId: data.task_id,
          status: data.status,
          message: formatExtractQuoteTaskMessage(data.status),
          result: data.result,
        });
      } catch {
        if (cancelled) {
          return;
        }

        setExtractQuoteTask({
          phase: "error",
          taskId: nextTaskId,
          message: "Unable to retrieve task status.",
        });
      }
    }

    pollTask();
    const intervalId = window.setInterval(() => {
      pollTask();
    }, TASK_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [extractQuoteTask.status, extractQuoteTask.taskId, isPolling]);

  return extractQuoteTask;
}

export function formatExtractQuoteTaskStatus(status: ExtractQuoteTaskStatus) {
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
