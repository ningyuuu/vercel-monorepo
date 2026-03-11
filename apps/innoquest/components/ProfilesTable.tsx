"use client";

import { useMemo, useState } from "react";
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

export function ProfilesTable({ data, testOptions }: ProfilesTableProps) {
  const [query, setQuery] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

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

  const renderSortableHeader = (label: string, columnKey: SortKey) => (
    <button
      type="button"
      onClick={() => toggleSort(columnKey)}
      className={cn(
        "hover:text-foreground inline-flex items-center gap-1.5 text-left transition-colors",
        sortKey === columnKey ? "text-foreground" : "text-muted-foreground",
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
              className="w-full !text-sm md:!text-sm"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setQuery("");
            setSelectedTests([]);
          }}
          disabled={!hasActiveFilters}
        >
          <X className="size-4" />
          Clear
        </Button>
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-[720px]">
          <caption className="text-muted-foreground mt-4 text-sm">
            {sortedData.length} of {data.length} records
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                {renderSortableHeader("Code", "code")}
              </TableHead>
              <TableHead className="w-[200px] whitespace-normal">
                {renderSortableHeader("Full Name", "full_name")}
              </TableHead>
              <TableHead className="w-[110px]">
                {renderSortableHeader("Cost", "cost")}
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
            {sortedData.map((project, index) => (
              <TableRow key={`${project.code}-${index}`}>
                <TableCell className="font-medium">{project.code}</TableCell>
                <TableCell className="whitespace-normal break-words">
                  {project.full_name}
                </TableCell>
                <TableCell>{project.cost}</TableCell>
                <TableCell className="whitespace-normal break-words">
                  <div className="flex flex-wrap gap-1">
                    {project.test_items.map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="whitespace-normal break-words text-muted-foreground text-sm">
                  {project.remarks}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
