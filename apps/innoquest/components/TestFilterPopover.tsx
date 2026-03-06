"use client";

import { useMemo, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { Input } from "@repo/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";

type TestFilterPopoverProps = {
  testOptions: string[];
  selectedTests: string[];
  onSelectedTestsChange: React.Dispatch<React.SetStateAction<string[]>>;
};

export function TestFilterPopover({
  testOptions,
  selectedTests,
  onSelectedTestsChange,
}: TestFilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [testFilterQuery, setTestFilterQuery] = useState("");

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
    onSelectedTestsChange((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  };

  const selectTest = (item: string) => {
    onSelectedTestsChange((current) =>
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

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setTestFilterQuery("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-9 w-full items-start justify-between py-2"
        >
          {selectedTests.length > 0 ? (
            <span className="flex min-w-0 flex-1 flex-wrap gap-1 text-left">
              {selectedTests.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </span>
          ) : (
            "Filter by tests"
          )}
          <ChevronsUpDown className="text-muted-foreground mt-0.5 size-4 shrink-0" />
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
  );
}
