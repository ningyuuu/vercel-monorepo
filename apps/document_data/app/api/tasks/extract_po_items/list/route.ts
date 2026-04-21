import { NextResponse } from "next/server";

import {
  getTaskApiBaseUrl,
  getTaskRequestAccess,
  readTaskApiError,
} from "@/lib/task-api";
import { type TaskListItem } from "@/lib/extract-po-items";

export const dynamic = "force-dynamic";

export type TaskListResponse = {
  tasks: TaskListItem[];
};

export async function GET() {
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

  const response = await fetch(`${apiBaseUrl}/tasks/extract_po_items`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: await readTaskApiError(response) },
      { status: response.status },
    );
  }

  const data = (await response.json()) as TaskListResponse;

  return NextResponse.json(data);
}
