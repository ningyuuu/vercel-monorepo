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
