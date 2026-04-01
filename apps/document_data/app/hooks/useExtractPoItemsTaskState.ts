import {
  type ExtractPoItemsTaskDetailResponse,
  type ExtractPoItemsTaskStatus,
} from "@/lib/extract-po-items";
import { useTaskState, type GenericTaskState } from "@/app/hooks/useTaskState";

export type ExtractPoItemsTaskState =
  GenericTaskState<ExtractPoItemsTaskStatus>;

type ExtractPoItemsTaskErrorResponse = {
  error?: string;
};

function formatExtractPoItemsTaskMessage(status: ExtractPoItemsTaskStatus) {
  switch (status) {
    case "queued":
      return "The purchase-order extraction task is queued.";
    case "in_progress":
      return "The purchase order is being processed.";
    case "completed":
      return "Purchase-order extraction complete.";
    case "failed":
      return "Purchase-order extraction failed.";
    default:
      return "Processing purchase-order extraction task.";
  }
}

function isExtractPoItemsTaskDetailResponse(
  value: ExtractPoItemsTaskDetailResponse | ExtractPoItemsTaskErrorResponse,
): value is ExtractPoItemsTaskDetailResponse {
  return "task_id" in value && "status" in value;
}

async function fetchExtractPoItemsTask(taskId: string) {
  const response = await fetch(
    `/api/tasks/extract_po_items/${encodeURIComponent(taskId)}`,
    {
      cache: "no-store",
    },
  );
  const data = (await response.json()) as
    | ExtractPoItemsTaskDetailResponse
    | ExtractPoItemsTaskErrorResponse;

  return {
    ok: response.ok,
    data,
  };
}

export function useExtractPoItemsTaskState(taskId: string) {
  return useTaskState({
    taskId,
    fetchTask: fetchExtractPoItemsTask,
    isTaskDetail: isExtractPoItemsTaskDetailResponse,
    formatTaskMessage: formatExtractPoItemsTaskMessage,
  });
}

export function formatExtractPoItemsTaskStatus(
  status: ExtractPoItemsTaskStatus,
) {
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
