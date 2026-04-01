"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import {
  formatExtractPoItemsTaskStatus,
  useExtractPoItemsTaskState,
} from "@/app/hooks/useExtractPoItemsTaskState";

type Props = { taskId: string };

function formatCellValue(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return "";
}

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

      return [item as Record<string, unknown>];
    });

    if (rows.length > 0) {
      return rows;
    }
  }

  return [];
}

function getResultColumns(rows: Record<string, unknown>[]) {
  return Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
}

function formatColumnLabel(column: string) {
  return column
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function PurchaseOrderResultView({ taskId }: Props) {
  const extractPoItemsTask = useExtractPoItemsTaskState(taskId);
  const rows = getResultRows(extractPoItemsTask.result);
  const columns = getResultColumns(rows);
  const prettyResult = extractPoItemsTask.result
    ? JSON.stringify(extractPoItemsTask.result, null, 2)
    : null;

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
      {extractPoItemsTask.phase === "error" ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {extractPoItemsTask.message}
        </p>
      ) : null}
      {extractPoItemsTask.phase === "success" && rows.length > 0 ? (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium">Extracted Purchase Order Items</p>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>
                    {formatColumnLabel(column)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={`po-item-${index}`}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${column}-${index}`}
                      className="whitespace-normal break-words"
                    >
                      {formatCellValue(row[column]) || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
      {extractPoItemsTask.phase === "success" && !prettyResult ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No purchase-order items were extracted.
        </p>
      ) : null}
      {extractPoItemsTask.phase === "success" && prettyResult ? (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium">Raw Result</p>
          <pre className="overflow-x-auto rounded-lg bg-background p-3 text-xs text-foreground">
            {prettyResult}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
