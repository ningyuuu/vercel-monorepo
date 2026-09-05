"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { ArrowDown, ArrowUp, ArrowUpDown, X } from "lucide-react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { cn } from "@repo/ui/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import type { TableRowData } from "@/lib/catalog";
import { TestFilterPopover } from "./TestFilterPopover";

type ProfilesTableProps = {
  data: TableRowData[];
  testOptions: string[];
};

type SortKey = "code" | "full_name" | "cost" | "test_contents" | "remarks";
type SortDirection = "asc" | "desc";

function getCostValue(value: string) {
  const numeric = Number.parseFloat(value.replace(/[^\d.]+/g, ""));

  return Number.isNaN(numeric) ? Number.NEGATIVE_INFINITY : numeric;
}

function getSortValue(record: TableRowData, sortKey: SortKey) {
  switch (sortKey) {
    case "cost":
      return getCostValue(record.cost);
    case "code":
    case "full_name":
    case "test_contents":
    case "remarks":
      return record[sortKey];
  }
}

function getTypeLabel(type: TableRowData["type"]) {
  if (type === "Single Allergy") {
    return "Single allergy";
  }

  if (type === "Single Test") {
    return "Single test";
  }

  return null;
}

function ContentsBadges({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => (
        <Badge
          key={item}
          variant="outline"
          className="text-muted-foreground font-normal"
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}

function TypeBadge({ type }: { type: TableRowData["type"] }) {
  const label = getTypeLabel(type);

  if (!label) {
    return null;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-1.5 font-normal uppercase tracking-wide",
        type === "Single Allergy"
          ? "border-primary/25 bg-primary/10 text-primary dark:bg-primary/15"
          : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-400/25 dark:bg-blue-950/50 dark:text-blue-300",
      )}
    >
      {label}
    </Badge>
  );
}

export function ProfilesTable({ data, testOptions }: ProfilesTableProps) {
  const [query, setQuery] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [navHeight, setNavHeight] = useState<number | null>(null);

  useEffect(() => {
    const nav = document.querySelector("nav");

    if (nav) {
      setNavHeight(nav.offsetHeight);
    }
  }, []);

  const activeSelectedTests = useMemo(() => {
    const availableTests = new Set(testOptions);

    return selectedTests.filter((item) => availableTests.has(item));
  }, [selectedTests, testOptions]);

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: [
          "code",
          "full_name",
          "test_contents",
          "test_items",
          "cost",
          "remarks",
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [data],
  );

  const filteredData = useMemo(() => {
    const normalized = query.trim();
    const searchResults = normalized
      ? fuse.search(normalized).map((result) => result.item)
      : data;

    if (activeSelectedTests.length === 0) {
      return searchResults;
    }

    const selectedSet = new Set(activeSelectedTests);

    return searchResults.filter((record) => {
      const recordItems = new Set(record.test_items);

      return [...selectedSet].every((item) => recordItems.has(item));
    });
  }, [activeSelectedTests, data, fuse, query]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((left, right) => {
      const leftValue = getSortValue(left, sortKey);
      const rightValue = getSortValue(right, sortKey);

      const comparison =
        typeof leftValue === "number" && typeof rightValue === "number"
          ? leftValue - rightValue
          : String(leftValue).localeCompare(String(rightValue), undefined, {
              numeric: true,
              sensitivity: "base",
            });

      if (comparison !== 0) {
        return sortDirection === "asc" ? comparison : -comparison;
      }

      return left.code.localeCompare(right.code, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [filteredData, sortDirection, sortKey]);

  const hasActiveFilters = query.length > 0 || activeSelectedTests.length > 0;

  const clearFilters = () => {
    setQuery("");
    setSelectedTests([]);
  };

  const toggleSort = (nextSortKey: SortKey) => {
    if (sortKey === nextSortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection("asc");
  };

  const renderSortIcon = (columnKey: SortKey) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="size-4 text-muted-foreground" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp className="size-4" />
    ) : (
      <ArrowDown className="size-4" />
    );
  };

  const renderSortableHeader = (
    label: string,
    columnKey: SortKey,
    className?: string,
  ) => (
    <button
      type="button"
      onClick={() => toggleSort(columnKey)}
      className={cn(
        "hover:text-foreground inline-flex items-center gap-1.5 text-left transition-colors",
        className,
        sortKey === columnKey
          ? "text-primary font-semibold"
          : "text-foreground/70",
      )}
      aria-label={`Sort by ${label}`}
      aria-pressed={sortKey === columnKey}
    >
      <span>{label}</span>
      {renderSortIcon(columnKey)}
    </button>
  );

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="w-full sm:w-1/2">
            <TestFilterPopover
              testOptions={testOptions}
              selectedTests={activeSelectedTests}
              onSelectedTestsChange={setSelectedTests}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Fuzzy search by code, name, contents, or cost..."
              aria-label="Fuzzy search profiles"
              className="h-auto w-full min-h-8 py-2"
              inputMode="search"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            <X className="size-4" />
            Clear
          </Button>
          <p
            className="text-muted-foreground text-sm tabular-nums"
            aria-live="polite"
          >
            {sortedData.length} of {data.length} records
          </p>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-12 text-center">
          <p className="text-foreground text-sm font-medium">
            No matching tests
          </p>
          <p className="text-sm">
            {hasActiveFilters
              ? "No records match your search or test filters. Try different terms or clear the filters."
              : "No records are available yet."}
          </p>
          {hasActiveFilters ? (
            <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
              <X className="size-4" />
              Clear filters
            </Button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="hidden w-full md:block">
            <div className="rounded-xl border bg-card p-1 shadow-sm">
              <Table className="min-w-[700px]">
                <caption className="sr-only">
                  Innoquest 2026 test profiles and individual tests
                </caption>
                <TableHeader
                  className="sticky top-16 z-10 bg-muted/50 backdrop-blur-sm"
                  style={navHeight !== null ? { top: navHeight } : undefined}
                >
                  <TableRow>
                    <TableHead className="w-[100px]">
                      {renderSortableHeader("Code", "code")}
                    </TableHead>
                    <TableHead className="w-[200px] whitespace-normal">
                      {renderSortableHeader("Full Name", "full_name")}
                    </TableHead>
                    <TableHead className="w-[110px] text-right">
                      {renderSortableHeader("Cost", "cost", "justify-end")}
                    </TableHead>
                    <TableHead className="whitespace-normal">
                      {renderSortableHeader("Test Contents", "test_contents")}
                    </TableHead>
                    <TableHead className="whitespace-normal">
                      {renderSortableHeader("Remarks", "remarks")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((record, index) => (
                    <TableRow key={`${record.code}-${index}`}>
                      <TableCell className="font-mono text-[13px] font-medium tabular-nums">
                        {record.code || "—"}
                      </TableCell>
                      <TableCell className="whitespace-normal break-words font-medium">
                        <span className="flex flex-wrap items-center gap-1.5">
                          {record.full_name}
                          <TypeBadge type={record.type} />
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-[13px] tabular-nums">
                        {record.cost}
                      </TableCell>
                      <TableCell className="whitespace-normal break-words">
                        <ContentsBadges items={record.test_items} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-normal break-words">
                        {record.remarks || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <ul className="md:hidden divide-y rounded-xl border bg-card px-3 py-1">
            {sortedData.map((record, index) => (
              <li key={`${record.code}-${index}`} className="space-y-2 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[13px] font-medium tabular-nums">
                    {record.code || "—"}
                  </span>
                  <span className="font-mono text-[13px] tabular-nums">
                    {record.cost}
                  </span>
                </div>
                <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
                  {record.full_name}
                  <TypeBadge type={record.type} />
                </p>
                <ContentsBadges items={record.test_items} />
                {record.remarks ? (
                  <p className="text-muted-foreground text-xs">
                    {record.remarks}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
