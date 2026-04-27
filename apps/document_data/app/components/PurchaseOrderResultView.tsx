"use client";

import { useState } from "react";
import {
  formatExtractPoItemsTaskStatus,
  useExtractPoItemsTaskState,
} from "@/app/hooks/useExtractPoItemsTaskState";
import { ChevronRight } from "lucide-react";
import { Button } from "@repo/ui/button";
import { PURCHASE_ORDER_COLUMNS } from "@/lib/airtable";
import { EditableTable, type Column } from "./EditableTable";

type Props = { taskId: string };

type ResultRow = Record<string, unknown>;

function getResultRows(result?: Record<string, unknown> | null) {
  const candidates = [result?.items, result?.po_items, result?.line_items];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    const rows = candidate.flatMap((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return [];
      }

      // Map keys to internal column keys for upload
      const mapped: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(
        item as Record<string, unknown>,
      )) {
        if (key in PURCHASE_ORDER_COLUMNS) {
          mapped[key] = value;
        }
      }

      return [mapped];
    });

    if (rows.length > 0) {
      return rows;
    }
  }

  return [];
}

function getColumns(rows: ResultRow[]): Column[] {
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  return keys.map((key) => ({
    key,
    label: PURCHASE_ORDER_COLUMNS[key]?.displayName ?? key,
  }));
}

export function PurchaseOrderResultView({ taskId }: Props) {
  const extractPoItemsTask = useExtractPoItemsTaskState(taskId);
  const initialRows = getResultRows(extractPoItemsTask.result);
  const columns = getColumns(initialRows);
  const prettyResult = extractPoItemsTask.result
    ? JSON.stringify(extractPoItemsTask.result, null, 2)
    : null;
  const [isRawResultOpen, setIsRawResultOpen] = useState(false);
  const [editedRows, setEditedRows] = useState<ResultRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    uploaded: number;
    errors: string[];
  } | null>(null);

  async function handleUpload() {
    if (isUploading) return;

    const rowsToUpload = editedRows.length > 0 ? editedRows : initialRows;
    if (rowsToUpload.length === 0) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const response = await fetch("/api/upload-airtable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: rowsToUpload }),
      });

      const result = (await response.json()) as {
        success: boolean;
        uploaded: number;
        errors: string[];
      };

      setUploadResult(result);
    } catch (error) {
      setUploadResult({
        success: false,
        uploaded: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      });
    } finally {
      setIsUploading(false);
    }
  }

  function handleCellSave(rowIndex: number, column: string, newValue: string) {
    setEditedRows((prev) => {
      const rows = prev.length > 0 ? [...prev] : [...initialRows];
      rows[rowIndex] = { ...rows[rowIndex] };
      rows[rowIndex][column] = newValue;
      return rows;
    });
  }

  return (
    <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium">
          {extractPoItemsTask.status
            ? `Task status: ${formatExtractPoItemsTaskStatus(extractPoItemsTask.status)}`
            : "Task status: Starting"}
        </p>
        <p className="text-xs text-muted-foreground">
          Task ID: {extractPoItemsTask.taskId}
        </p>
      </div>
      {extractPoItemsTask.message ? (
        <p className="mt-1 text-sm text-muted-foreground">
          {extractPoItemsTask.message}
        </p>
      ) : null}

      {extractPoItemsTask.phase === "success" && prettyResult ? (
        <div className="mt-3 space-y-2">
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium hover:opacity-80"
            onClick={() => setIsRawResultOpen(!isRawResultOpen)}
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${isRawResultOpen ? "rotate-90" : ""}`}
            />
            See Raw Result
          </button>
          {isRawResultOpen && (
            <pre className="overflow-x-auto rounded-lg bg-background p-3 text-xs text-foreground">
              {prettyResult}
            </pre>
          )}
        </div>
      ) : null}
      {extractPoItemsTask.phase === "error" ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {extractPoItemsTask.message}
        </p>
      ) : null}
      {extractPoItemsTask.phase === "success" && initialRows.length > 0 ? (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium">Extracted Purchase Order Items</p>
          <EditableTable
            rows={initialRows}
            columns={columns}
            onCellSave={handleCellSave}
          />
          <div className="flex justify-end">
            <Button type="button" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload to Airtable"}
            </Button>
          </div>
          {uploadResult && (
            <p
              className={`mt-2 text-sm ${uploadResult.success ? "text-green-600" : "text-destructive"}`}
            >
              {uploadResult.success
                ? `Successfully uploaded ${uploadResult.uploaded} rows`
                : `Upload failed: ${uploadResult.errors.join(", ")}`}
            </p>
          )}
        </div>
      ) : null}
      {extractPoItemsTask.phase === "success" && !prettyResult ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No purchase-order items were extracted.
        </p>
      ) : null}
    </div>
  );
}
