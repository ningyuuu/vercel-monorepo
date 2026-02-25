"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@repo/ui/button";
import {
  applyOperation,
  formatCardValue,
  isTwentyFour,
  type Operation,
} from "@/lib/twentyFour";

const OPERATIONS: Operation[] = ["+", "-", "*", "/"];
const OPERATION_LABELS: Record<Operation, string> = {
  "+": "＋",
  "-": "−",
  "*": "×",
  "/": "÷",
};

const DEAL_DELAY_MS = 500;
const INVALID_MOVE_MESSAGE =
  "Invalid move. Division must result in a whole number.";

export default function Board({
  cards,
  disabled,
  onCardsChange,
  onOperationMessage,
  onFirstSelection,
  onDealSolved,
  onReset,
}: {
  cards: Array<number | null>;
  disabled: boolean;
  onCardsChange: (nextCards: Array<number | null>) => void;
  onOperationMessage: (message: string) => void;
  onFirstSelection: () => void; // to set Timer
  onDealSolved: () => void;
  onReset: () => void;
}) {
  const [selectedFirstIndex, setSelectedFirstIndex] = useState<number | null>(
    null,
  );
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null,
  );
  const [isDelaying, setIsDelaying] = useState(false);

  const delayTimeoutRef = useRef<number | null>(null);
  const boardDisabled = disabled || isDelaying;

  useEffect(() => {
    return () => {
      if (delayTimeoutRef.current !== null) {
        window.clearTimeout(delayTimeoutRef.current);
      }
    };
  }, []);

  function handleOperationClick(op: Operation) {
    if (selectedFirstIndex === null || boardDisabled) return;
    setSelectedOperation(op);
    onOperationMessage("");
  }

  function handleCardClick(index: number) {
    if (boardDisabled) return;

    const clickedValue = cards[index];
    if (clickedValue === null) return;

    if (selectedFirstIndex === null) {
      onFirstSelection();
      setSelectedFirstIndex(index);
      onOperationMessage("");
      return;
    }

    if (selectedFirstIndex === index) {
      setSelectedFirstIndex(null);
      setSelectedOperation(null);
      onOperationMessage("");
      return;
    }

    if (selectedOperation === null) {
      setSelectedFirstIndex(index);
      onOperationMessage("");
      return;
    }

    const firstValue = cards[selectedFirstIndex];
    if (firstValue === null) return;

    const result = applyOperation(firstValue, clickedValue, selectedOperation);
    if (result === null) {
      onOperationMessage(INVALID_MOVE_MESSAGE);
      return;
    }

    const nextCards = [...cards];
    nextCards[selectedFirstIndex] = null;
    nextCards[index] = result;

    onCardsChange(nextCards);
    setSelectedFirstIndex(index);
    setSelectedOperation(null);
    onOperationMessage("");

    const remaining = nextCards.filter(
      (value): value is number => value !== null,
    );
    if (remaining.length === 1 && isTwentyFour(remaining[0])) {
      setIsDelaying(true);
      delayTimeoutRef.current = window.setTimeout(() => {
        setIsDelaying(false);
        onDealSolved();
      }, DEAL_DELAY_MS);
    }
  }

  return (
    <>
      <div className="grid w-full max-w-md grid-cols-2 gap-4">
        {cards.map((value, index) => (
          <button
            key={index}
            type="button"
            disabled={value === null || boardDisabled}
            onClick={() => handleCardClick(index)}
            className={`aspect-square rounded-xl border text-3xl font-semibold transition ${
              value === null
                ? "cursor-default border-dashed border-muted-foreground/20 bg-muted/30 text-transparent"
                : boardDisabled
                  ? "cursor-not-allowed border-border bg-card"
                  : selectedFirstIndex === index
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            {value === null ? " " : formatCardValue(value)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {OPERATIONS.map((op) => (
          <Button
            key={op}
            type="button"
            variant={selectedOperation === op ? "default" : "outline"}
            onClick={() => handleOperationClick(op)}
            disabled={boardDisabled}
            className="min-w-14 text-xl"
          >
            {OPERATION_LABELS[op]}
          </Button>
        ))}
      </div>

      <Button type="button" onClick={onReset} disabled={boardDisabled}>
        Reset
      </Button>
    </>
  );
}
