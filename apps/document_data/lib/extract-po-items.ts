export type ExtractPoItemsTaskStatus =
  | "queued"
  | "in_progress"
  | "completed"
  | "failed";

export type ExtractPoItemsRequestBody = {
  user_link: string;
  blob_link: string;
  blob_type: "vercel";
};

export type ExtractPoItemsTaskErrorResponse = {
  error?: string;
};

export type ExtractPoItemsTaskAcceptedResponse = {
  task_id: string;
  status: ExtractPoItemsTaskStatus;
};

export type ExtractPoItemsTaskDetailResponse = {
  task_id: string;
  status: ExtractPoItemsTaskStatus;
  result: Record<string, unknown> | null;
  error: string | null;
};

export type TaskListItem = {
  task_id: string;
  email: string;
  task_name: string;
  status: string;
  created_at: string;
  result: Record<string, unknown> | null;
  error: string | null;
};

function isExtractPoItemsTaskAcceptedResponse(
  value: ExtractPoItemsTaskAcceptedResponse | ExtractPoItemsTaskErrorResponse,
): value is ExtractPoItemsTaskAcceptedResponse {
  return "task_id" in value && "status" in value;
}

export async function createExtractPoItemsTask(payload: ExtractPoItemsRequestBody): Promise<
  | { ok: true; data: ExtractPoItemsTaskAcceptedResponse }
  | { ok: false; error: string }
> {
  const response = await fetch("/api/tasks/extract_po_items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as
    | ExtractPoItemsTaskAcceptedResponse
    | ExtractPoItemsTaskErrorResponse;

  if (!response.ok || !isExtractPoItemsTaskAcceptedResponse(data)) {
    return {
      ok: false,
      error:
        (isExtractPoItemsTaskAcceptedResponse(data)
          ? undefined
          : data.error) ||
        "Failed to start extraction task.",
    };
  }

  return { ok: true, data };
}
