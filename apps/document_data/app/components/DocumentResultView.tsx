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
  useExtractQuoteTaskState,
  formatExtractQuoteTaskStatus,
} from "@/app/hooks/useExtractQuoteTaskState";

type Props = { taskId: string };

type ExtractedItemRow = {
  name: string;
  unit: string;
  unit_cost: string;
  qty_count: string;
  remarks: string;
};

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

    return [
      {
        name: formatCellValue(row.name),
        unit: formatCellValue(row.unit),
        unit_cost: formatCellValue(row.unit_cost),
        qty_count: formatCellValue(row.qty_count),
        remarks: formatCellValue(row.remarks),
      } satisfies ExtractedItemRow,
    ];
  });
}

function getSummaryText(result?: Record<string, unknown> | null) {
  const summary = result?.result;

  return typeof summary === "string" ? summary : null;
}

export function DocumentResultView({ taskId }: Props) {
  const extractQuoteTask = useExtractQuoteTaskState(taskId);

  const extractedItems = getExtractedItems(extractQuoteTask.result);
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extractedItems.map((item, index) => (
                <TableRow key={`${item.name}-${item.unit}-${index}`}>
                  <TableCell className="whitespace-normal break-words font-medium">
                    {item.name || "-"}
                  </TableCell>
                  <TableCell>{item.unit || "-"}</TableCell>
                  <TableCell>${item.unit_cost || "-"}</TableCell>
                  <TableCell>{item.qty_count || "-"}</TableCell>
                  <TableCell className="whitespace-normal break-words text-muted-foreground">
                    {item.remarks || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
