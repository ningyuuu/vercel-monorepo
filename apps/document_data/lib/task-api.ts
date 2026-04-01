import { auth, isAllowedEmail } from "@/lib/auth";

export function getTaskApiBaseUrl() {
  const apiBaseUrl = process.env.LLM_API_BASE_URL?.trim();

  if (!apiBaseUrl) {
    return null;
  }

  return apiBaseUrl.replace(/\/+$/, "");
}

export async function getTaskRequestAccess() {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be signed in to process a document.",
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
      error: "You do not have access to process documents.",
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
