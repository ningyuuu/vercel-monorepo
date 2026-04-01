import { NextResponse } from "next/server";

import {
  type ExtractPoItemsRequestBody,
  type ExtractPoItemsTaskAcceptedResponse,
} from "@/lib/extract-po-items";
import {
  getTaskApiBaseUrl,
  getTaskRequestAccess,
  readTaskApiError,
} from "@/lib/task-api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const access = await getTaskRequestAccess();

  if ("error" in access) {
    return NextResponse.json(
      { error: access.error },
      { status: access.status },
    );
  }

  const apiBaseUrl = getTaskApiBaseUrl();

  if (!apiBaseUrl) {
    return NextResponse.json(
      { error: "LLM_API_BASE_URL is not configured." },
      { status: 500 },
    );
  }

  let payload: ExtractPoItemsRequestBody;

  try {
    payload = (await request.json()) as ExtractPoItemsRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (
    !payload.user_link ||
    !payload.blob_link ||
    payload.blob_type !== "vercel"
  ) {
    return NextResponse.json(
      {
        error:
          "Request body must include user_link, blob_link, and blob_type='vercel'.",
      },
      { status: 400 },
    );
  }

  const response = await fetch(`${apiBaseUrl}/tasks/extract_po_items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      email: access.email,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: await readTaskApiError(response) },
      { status: response.status },
    );
  }

  const data = (await response.json()) as ExtractPoItemsTaskAcceptedResponse;

  return NextResponse.json(data, { status: response.status });
}
