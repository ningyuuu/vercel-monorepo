import { NextResponse } from "next/server";

import { getTaskRequestAccess } from "@/lib/task-api";
import { uploadToAirtable } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const access = await getTaskRequestAccess();

  if ("error" in access) {
    return NextResponse.json(
      { error: access.error },
      { status: access.status },
    );
  }

  let payload: { data: Record<string, unknown>[] };

  try {
    payload = (await request.json()) as { data: Record<string, unknown>[] };
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (!payload.data || !Array.isArray(payload.data)) {
    return NextResponse.json(
      { error: "Request body must include data array." },
      { status: 400 },
    );
  }

  try {
    const result = await uploadToAirtable(payload.data);

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("Error uploading to Airtable:", error);
    return NextResponse.json(
      {
        success: false,
        uploaded: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      },
      { status: 500 },
    );
  }
}
