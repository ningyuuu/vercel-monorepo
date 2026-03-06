"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { X } from "lucide-react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
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

export function ProfilesTable({ data, testOptions }: ProfilesTableProps) {
  const [query, setQuery] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: ["code", "full_name", "test_contents", "test_items", "cost"],
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

    if (selectedTests.length === 0) {
      return searchResults;
    }

    const selectedSet = new Set(selectedTests);

    return searchResults.filter((record) =>
      record.test_items.some((item) => selectedSet.has(item)),
    );
  }, [data, fuse, query, selectedTests]);

  const hasActiveFilters = query.length > 0 || selectedTests.length > 0;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1/2">
            <TestFilterPopover
              testOptions={testOptions}
              selectedTests={selectedTests}
              onSelectedTestsChange={setSelectedTests}
            />
          </div>
          <div className="w-1/2">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Fuzzy search by code, name, contents, or cost..."
              aria-label="Fuzzy search profiles"
              className="w-full"
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

      <Table className="w-full table-fixed">
        <caption className="text-muted-foreground mt-4 text-sm">
          {filteredData.length} of {data.length} records
        </caption>
        <TableHeader>
          <TableRow>
            <TableHead className="md:w-[100px]">Code</TableHead>
            <TableHead className="whitespace-normal md:w-[200px]">
              Full Name
            </TableHead>
            <TableHead className="md:w-[110px]">Cost</TableHead>
            <TableHead className="hidden whitespace-normal md:table-cell">
              Test Contents
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((project, index) => (
            <TableRow key={`${project.code}-${index}`}>
              <TableCell className="font-medium">{project.code}</TableCell>
              <TableCell className="whitespace-normal break-words">
                {project.full_name}
              </TableCell>
              <TableCell>{project.cost}</TableCell>
              <TableCell className="hidden whitespace-normal break-words md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {project.test_items.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
