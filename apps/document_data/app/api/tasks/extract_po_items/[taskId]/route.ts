import { NextResponse } from "next/server";

import { type ExtractPoItemsTaskDetailResponse } from "@/lib/extract-po-items";
import {
  getTaskApiBaseUrl,
  getTaskRequestAccess,
  readTaskApiError,
} from "@/lib/task-api";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ taskId: string }> },
) {
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

  const { taskId } = await context.params;

  if (!taskId) {
    return NextResponse.json(
      { error: "Task id is required." },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${apiBaseUrl}/tasks/extract_po_items/${encodeURIComponent(taskId)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: await readTaskApiError(response) },
      { status: response.status },
    );
  }

  const data = (await response.json()) as ExtractPoItemsTaskDetailResponse;

  return NextResponse.json(data, { status: response.status });
}
