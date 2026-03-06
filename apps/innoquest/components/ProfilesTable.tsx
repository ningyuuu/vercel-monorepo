"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { Input } from "@repo/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
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
  testOptions: string[];
};

export function ProfilesTable({ data, testOptions }: ProfilesTableProps) {
  const [query, setQuery] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [isTestFilterOpen, setIsTestFilterOpen] = useState(false);
  const [testFilterQuery, setTestFilterQuery] = useState("");

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

  const filteredTestOptions = useMemo(() => {
    const normalized = testFilterQuery.trim().toLowerCase();

    if (!normalized) {
      return testOptions;
    }

    return [...testOptions]
      .filter((item) => item.toLowerCase().includes(normalized))
      .sort((left, right) => {
        const leftStarts = left.toLowerCase().startsWith(normalized) ? 0 : 1;
        const rightStarts = right.toLowerCase().startsWith(normalized) ? 0 : 1;

        if (leftStarts !== rightStarts) {
          return leftStarts - rightStarts;
        }

        return left.localeCompare(right);
      });
  }, [testFilterQuery, testOptions]);

  const toggleTest = (item: string) => {
    setSelectedTests((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  };

  const selectTest = (item: string) => {
    setSelectedTests((current) =>
      current.includes(item) ? current : [...current, item],
    );
  };

  const selectTestFromInput = () => {
    if (filteredTestOptions.length === 0) {
      return;
    }

    const exactMatch = filteredTestOptions.find(
      (item) => item.toLowerCase() === testFilterQuery.trim().toLowerCase(),
    );

    selectTest(exactMatch ?? filteredTestOptions[0]);
    setTestFilterQuery("");
  };

  const hasActiveFilters = query.length > 0 || selectedTests.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Fuzzy search by code, name, contents, or cost..."
          aria-label="Fuzzy search profiles"
          className="w-full"
        />
        <Popover
          open={isTestFilterOpen}
          onOpenChange={(open) => {
            setIsTestFilterOpen(open);
            if (!open) {
              setTestFilterQuery("");
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between sm:w-[280px]"
            >
              {selectedTests.length > 0
                ? `${selectedTests.length} tests selected`
                : "Filter by tests"}
              <ChevronsUpDown className="text-muted-foreground size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[min(20rem,calc(100vw-2rem))] p-0"
            align="start"
          >
            <div className="border-b p-2">
              <Input
                value={testFilterQuery}
                onChange={(event) => setTestFilterQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    selectTestFromInput();
                  }
                }}
                placeholder="Type test and press Enter..."
                aria-label="Search tests"
              />
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              <div className="space-y-1">
                {filteredTestOptions.map((item, index) => {
                  const checked = selectedTests.includes(item);
                  const inputId = `test-option-${index}`;

                  return (
                    <label
                      key={item}
                      htmlFor={inputId}
                      className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
                    >
                      <Checkbox
                        id={inputId}
                        checked={checked}
                        onCheckedChange={() => toggleTest(item)}
                        aria-label={`Select ${item}`}
                      />
                      <span className="flex-1">{item}</span>
                    </label>
                  );
                })}
                {filteredTestOptions.length === 0 ? (
                  <p className="text-muted-foreground px-2 py-3 text-sm">
                    No matching tests.
                  </p>
                ) : null}
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
