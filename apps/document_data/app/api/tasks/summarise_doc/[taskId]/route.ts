import { NextResponse } from "next/server";

import {
  getSummariseDocApiBaseUrl,
  getTaskRequestAccess,
  readTaskApiError,
  type SummaryTaskDetailResponse,
} from "@/lib/summarise-doc";

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

  const { taskId } = await context.params;

  if (!taskId) {
    return NextResponse.json(
      { error: "Task id is required." },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${getSummariseDocApiBaseUrl()}/tasks/extract_data/${encodeURIComponent(taskId)}`,
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

  const data = (await response.json()) as SummaryTaskDetailResponse;

  return NextResponse.json(data, { status: response.status });
}
