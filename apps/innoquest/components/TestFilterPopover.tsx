"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { Input } from "@repo/ui/input";
import { cn } from "@repo/ui/lib/utils";
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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const optionRefs = useRef<Array<HTMLLabelElement | null>>([]);

  const filteredTestOptions = useMemo(() => {
    const normalized = testFilterQuery.trim().toLowerCase();
    const selectedSet = new Set(selectedTests);

    const sortBySelectionAndName = (left: string, right: string) => {
      const leftSelected = selectedSet.has(left) ? 0 : 1;
      const rightSelected = selectedSet.has(right) ? 0 : 1;

      if (leftSelected !== rightSelected) {
        return leftSelected - rightSelected;
      }

      return left.localeCompare(right);
    };

    if (!normalized) {
      return [...testOptions].sort(sortBySelectionAndName);
    }

    return [...testOptions]
      .filter((item) => item.toLowerCase().includes(normalized))
      .sort((left, right) => {
        const selectionSort = sortBySelectionAndName(left, right);

        if (selectionSort !== 0) {
          return selectionSort;
        }

        const leftStarts = left.toLowerCase().startsWith(normalized) ? 0 : 1;
        const rightStarts = right.toLowerCase().startsWith(normalized) ? 0 : 1;

        if (leftStarts !== rightStarts) {
          return leftStarts - rightStarts;
        }

        return left.localeCompare(right);
      });
  }, [selectedTests, testFilterQuery, testOptions]);

  const activeIndex =
    filteredTestOptions.length === 0
      ? -1
      : Math.min(Math.max(highlightedIndex, 0), filteredTestOptions.length - 1);

  useEffect(() => {
    if (activeIndex < 0) {
      return;
    }

    optionRefs.current[activeIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

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

    const selectedItem =
      activeIndex >= 0
        ? filteredTestOptions[activeIndex]
        : filteredTestOptions[0];

    selectTest(selectedItem);
    setTestFilterQuery("");
    setHighlightedIndex(0);
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setTestFilterQuery("");
          setHighlightedIndex(0);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-8 w-full items-start justify-between py-2 whitespace-normal"
        >
          {selectedTests.length > 0 ? (
            <span className="flex min-w-0 flex-1 flex-wrap gap-1 whitespace-normal text-left">
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
            onChange={(event) => {
              setTestFilterQuery(event.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();

                if (filteredTestOptions.length === 0) {
                  return;
                }

                setHighlightedIndex((current) =>
                  current >= filteredTestOptions.length - 1 ? 0 : current + 1,
                );
                return;
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();

                if (filteredTestOptions.length === 0) {
                  return;
                }

                setHighlightedIndex((current) =>
                  current <= 0 ? filteredTestOptions.length - 1 : current - 1,
                );
                return;
              }

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
              const isHighlighted = index === activeIndex;

              return (
                <label
                  key={item}
                  htmlFor={inputId}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                    isHighlighted && "bg-muted",
                  )}
                >
                  <Checkbox
                    id={inputId}
                    checked={checked}
                    onCheckedChange={() => toggleTest(item)}
                    aria-label={`Select ${item}`}
                    className="data-[state=checked]:text-white dark:data-[state=checked]:text-white [&_[data-slot=checkbox-indicator]>svg]:stroke-[3]"
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
