import { NextResponse } from "next/server";

import {
  getExtractQuoteApiBaseUrl,
  getExtractQuoteTaskRequestAccess,
  readExtractQuoteTaskApiError,
  type ExtractQuoteTaskDetailResponse,
} from "@/lib/extract-quote";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ taskId: string }> },
) {
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

  const { taskId } = await context.params;

  if (!taskId) {
    return NextResponse.json(
      { error: "Task id is required." },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${apiBaseUrl}/tasks/extract_quote/${encodeURIComponent(taskId)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: await readExtractQuoteTaskApiError(response) },
      { status: response.status },
    );
  }

  const data = (await response.json()) as ExtractQuoteTaskDetailResponse;

  return NextResponse.json(data, { status: response.status });
}
