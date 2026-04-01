"use client";

import { useEffect, useState } from "react";

const TASK_POLL_INTERVAL_MS = 5000;

type TaskLifecyclePhase = "idle" | "polling" | "success" | "error";
type TerminalTaskStatus = "completed" | "failed";

type TaskDetailShape<TStatus extends string> = {
  task_id: string;
  status: TStatus;
  result: Record<string, unknown> | null;
  error: string | null;
};

type TaskErrorShape = {
  error?: string;
};

export type GenericTaskState<TStatus extends string> = {
  phase: TaskLifecyclePhase;
  taskId: string;
  status?: TStatus;
  message?: string;
  result?: Record<string, unknown> | null;
};

type FetchTaskResult<
  TDetail extends TaskDetailShape<TStatus>,
  TStatus extends string,
> = {
  ok: boolean;
  data: TDetail | TaskErrorShape;
};

type UseTaskStateOptions<
  TDetail extends TaskDetailShape<TStatus>,
  TStatus extends string,
> = {
  taskId: string;
  fetchTask: (taskId: string) => Promise<FetchTaskResult<TDetail, TStatus>>;
  isTaskDetail: (value: TDetail | TaskErrorShape) => value is TDetail;
  formatTaskMessage: (status: TStatus) => string;
};

export function useTaskState<
  TDetail extends TaskDetailShape<TStatus>,
  TStatus extends string,
>({
  taskId,
  fetchTask,
  isTaskDetail,
  formatTaskMessage,
}: UseTaskStateOptions<TDetail, TStatus>): GenericTaskState<TStatus> {
  const [taskState, setTaskState] = useState<GenericTaskState<TStatus>>({
    phase: "polling",
    taskId,
    message: "Loading task status...",
  });

  const isPolling =
    taskState.phase === "polling" &&
    Boolean(taskState.taskId) &&
    !(["completed", "failed"] as TerminalTaskStatus[]).includes(
      (taskState.status ?? "") as TerminalTaskStatus,
    );

  useEffect(() => {
    if (!isPolling || !taskState.taskId) {
      return;
    }

    let cancelled = false;
    const nextTaskId = taskState.taskId;

    async function pollTask() {
      try {
        const { ok, data } = await fetchTask(nextTaskId);

        if (cancelled) {
          return;
        }

        if (!ok || !isTaskDetail(data)) {
          setTaskState({
            phase: "error",
            taskId: nextTaskId,
            message: data.error || "Unable to retrieve task status.",
          });
          return;
        }

        if (data.status === "completed") {
          setTaskState({
            phase: "success",
            taskId: data.task_id,
            status: data.status,
            message: formatTaskMessage(data.status),
            result: data.result,
          });
          return;
        }

        if (data.status === "failed") {
          setTaskState({
            phase: "error",
            taskId: data.task_id,
            status: data.status,
            message: data.error || formatTaskMessage(data.status),
            result: data.result,
          });
          return;
        }

        setTaskState({
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

        setTaskState({
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
  }, [fetchTask, formatTaskMessage, isPolling, isTaskDetail, taskState.taskId]);

  return taskState;
}
