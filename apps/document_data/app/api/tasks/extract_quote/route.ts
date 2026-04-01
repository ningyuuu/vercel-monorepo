import { NextResponse } from "next/server";

import {
  getExtractQuoteApiBaseUrl,
  getExtractQuoteTaskRequestAccess,
  readExtractQuoteTaskApiError,
  type ExtractQuoteRequestBody,
  type ExtractQuoteTaskAcceptedResponse,
} from "@/lib/extract-quote";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const access = await getExtractQuoteTaskRequestAccess();

  if ("error" in access) {
    return NextResponse.json(
      { error: access.error },
      { status: access.status },
    );
  }

  const apiBaseUrl = getExtractQuoteApiBaseUrl();

  if (!apiBaseUrl) {
    return NextResponse.json(
      { error: "EXTRACT_QUOTE_API_BASE_URL is not configured." },
      { status: 500 },
    );
  }

  let payload: ExtractQuoteRequestBody;

  try {
    payload = (await request.json()) as ExtractQuoteRequestBody;
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

  const response = await fetch(`${apiBaseUrl}/tasks/extract_quote`, {
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
      { error: await readExtractQuoteTaskApiError(response) },
      { status: response.status },
    );
  }

  const data = (await response.json()) as ExtractQuoteTaskAcceptedResponse;

  return NextResponse.json(data, { status: response.status });
}
