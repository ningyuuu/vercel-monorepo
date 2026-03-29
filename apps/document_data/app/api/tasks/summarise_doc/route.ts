import { NextResponse } from "next/server";

import {
  getSummariseDocApiBaseUrl,
  getTaskRequestAccess,
  readTaskApiError,
  type SummariseDocRequestBody,
  type SummaryTaskAcceptedResponse,
} from "@/lib/summarise-doc";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const access = await getTaskRequestAccess();

  if ("error" in access) {
    return NextResponse.json(
      { error: access.error },
      { status: access.status },
    );
  }

  let payload: SummariseDocRequestBody;

  try {
    payload = (await request.json()) as SummariseDocRequestBody;
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

  const response = await fetch(
    `${getSummariseDocApiBaseUrl()}/tasks/extract_data`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        email: access.email,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: await readTaskApiError(response) },
      { status: response.status },
    );
  }

  const data = (await response.json()) as SummaryTaskAcceptedResponse;

  return NextResponse.json(data, { status: response.status });
}
