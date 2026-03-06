"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
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

type ProfilesTableProps = {
  data: TableRowData[];
};

export function ProfilesTable({ data }: ProfilesTableProps) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: ["code", "full_name", "test_contents", "cost"],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [data],
  );

  const filteredData = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) {
      return data;
    }

    return fuse.search(normalized).map((result) => result.item);
  }, [data, fuse, query]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Fuzzy search by code, name, contents, or cost..."
          aria-label="Fuzzy search profiles"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setQuery("")}
          disabled={!query}
        >
          Clear
        </Button>
      </div>

      <Table className="w-full table-fixed">
        <caption className="text-muted-foreground mt-4 text-sm">
          {filteredData.length} of {data.length} records
        </caption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Code</TableHead>
            <TableHead className="w-[200px] whitespace-normal">
              Full Name
            </TableHead>
            <TableHead className="w-[110px]">Cost</TableHead>
            <TableHead className="whitespace-normal">Test Contents</TableHead>
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
              <TableCell className="whitespace-normal break-words">
                {project.test_contents}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}