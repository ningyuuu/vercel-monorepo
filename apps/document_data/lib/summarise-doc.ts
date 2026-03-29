import { auth, isAllowedEmail } from "@/lib/auth";

const DEFAULT_SUMMARISE_DOC_API_BASE_URL = "http://localhost:8000";

export type SummaryTaskStatus =
  | "queued"
  | "in_progress"
  | "completed"
  | "failed";

export type SummariseDocRequestBody = {
  user_link: string;
  blob_link: string;
  blob_type: "vercel";
};

export type SummaryTaskAcceptedResponse = {
  task_id: string;
  status: SummaryTaskStatus;
};

export type SummaryTaskDetailResponse = {
  task_id: string;
  status: SummaryTaskStatus;
  result: Record<string, unknown> | null;
  error: string | null;
};

export function getSummariseDocApiBaseUrl() {
  return (
    process.env.SUMMARISE_DOC_API_BASE_URL ?? DEFAULT_SUMMARISE_DOC_API_BASE_URL
  ).replace(/\/+$/, "");
}

export async function getTaskRequestAccess() {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be signed in to summarise a document.",
      status: 401,
    } as const;
  }

  const email = session.user.email?.trim().toLowerCase();

  if (!email) {
    return {
      error: "Authenticated user is missing an email address.",
      status: 401,
    } as const;
  }

  if (!isAllowedEmail(email)) {
    return {
      error: "You do not have access to summarise documents.",
      status: 403,
    } as const;
  }

  return { email } as const;
}

export async function readTaskApiError(response: Response) {
  try {
    const data = (await response.json()) as {
      detail?: string;
      error?: string;
      message?: string;
    };

    return (
      data.detail ||
      data.error ||
      data.message ||
      `Task API request failed with status ${response.status}.`
    );
  } catch {
    return `Task API request failed with status ${response.status}.`;
  }
}
