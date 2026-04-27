"use client";

import {
  formatExtractQuoteTaskStatus,
  useExtractQuoteTaskState,
} from "@/app/hooks/useExtractQuoteTaskState";

import { EditableTable, type Column } from "./EditableTable";

type Props = { taskId: string };

type ExtractedItemRow = Record<string, unknown>;

function formatCellValue(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }

  return typeof value === "string" ? value : "";
}

function getExtractedItems(result?: Record<string, unknown> | null) {
  const items = result?.items;

  if (!Array.isArray(items)) {
    return [];
  }

  return items.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const row = item as Record<string, unknown>;
    const formattedRow: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(row)) {
      formattedRow[key] = formatCellValue(value);
    }

    return [formattedRow];
  });
}

function getColumns(rows: ExtractedItemRow[]): Column[] {
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  return keys.map((key) => ({
    key,
    label: key
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
  }));
}

function getSummaryText(result?: Record<string, unknown> | null) {
  const summary = result?.result;

  return typeof summary === "string" ? summary : null;
}

export function DocumentResultView({ taskId }: Props) {
  const extractQuoteTask = useExtractQuoteTaskState(taskId);
  const extractedItems = getExtractedItems(extractQuoteTask.result);
  const columns = getColumns(extractedItems);
  const summaryText = getSummaryText(extractQuoteTask.result);

  return (
    <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium">
          {extractQuoteTask.status
            ? `Task status: ${formatExtractQuoteTaskStatus(extractQuoteTask.status)}`
            : "Task status: Starting"}
        </p>
        <p className="text-xs text-muted-foreground">
          Task ID: {extractQuoteTask.taskId}
        </p>
      </div>
      {extractQuoteTask.message ? (
        <p className="mt-1 text-sm text-muted-foreground">
          {extractQuoteTask.message}
        </p>
      ) : null}
      {extractQuoteTask.phase === "error" ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {extractQuoteTask.message}
        </p>
      ) : null}
      {extractQuoteTask.phase === "success" && extractedItems.length > 0 ? (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium">Extracted Items</p>
          <EditableTable rows={extractedItems} columns={columns} />
        </div>
      ) : null}
      {extractQuoteTask.phase === "success" &&
      extractedItems.length === 0 &&
      !summaryText ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No quoted items were extracted.
        </p>
      ) : null}
      {extractQuoteTask.phase === "success" && summaryText ? (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium">Result</p>
          <p className="whitespace-pre-wrap text-sm text-foreground">
            {summaryText}
          </p>
        </div>
      ) : null}
    </div>
  );
}
