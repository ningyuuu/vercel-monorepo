import {
  type ExtractQuoteTaskDetailResponse,
  type ExtractQuoteTaskStatus,
} from "@/lib/extract-quote";
import { useTaskState, type GenericTaskState } from "@/app/hooks/useTaskState";

export type ExtractQuoteTaskState = GenericTaskState<ExtractQuoteTaskStatus>;

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
  return useTaskState({
    taskId,
    fetchTask: fetchExtractQuoteTask,
    isTaskDetail: isExtractQuoteTaskDetailResponse,
    formatTaskMessage: formatExtractQuoteTaskMessage,
  });
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
