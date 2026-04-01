import { auth, isAllowedEmail } from "@/lib/auth";

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

export function getExtractQuoteApiBaseUrl() {
  const apiBaseUrl = process.env.LLM_API_BASE_URL?.trim();

  if (!apiBaseUrl) {
    return null;
  }

  return apiBaseUrl.replace(/\/+$/, "");
}

export async function getExtractQuoteTaskRequestAccess() {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be signed in to extract a quote.",
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
      error: "You do not have access to extract quotes.",
      status: 403,
    } as const;
  }

  return { email } as const;
}

export async function readExtractQuoteTaskApiError(response: Response) {
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
