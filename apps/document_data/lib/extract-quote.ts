export type ExtractQuoteTaskStatus =
  | "queued"
  | "in_progress"
  | "completed"
  | "failed";

export type ExtractQuoteRequestBody = {
  user_link: string;
  blob_link: string;
  blob_type: "vercel";
};

export type ExtractQuoteTaskAcceptedResponse = {
  task_id: string;
  status: ExtractQuoteTaskStatus;
};

export type ExtractQuoteTaskDetailResponse = {
  task_id: string;
  status: ExtractQuoteTaskStatus;
  result: Record<string, unknown> | null;
  error: string | null;
};
