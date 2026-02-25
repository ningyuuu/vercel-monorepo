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
  onFirstSelection,
  onDealSolved,
  getRevealAnswer,
  onReset,
}: {
  cards: Array<number | null>;
  disabled: boolean;
  onCardsChange: (nextCards: Array<number | null>) => void;
  onFirstSelection: () => void; // to set Timer
  onDealSolved: () => void;
  getRevealAnswer: () => string;
  onReset: () => void;
}) {
  const [selectedFirstIndex, setSelectedFirstIndex] = useState<number | null>(
    null,
  );
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null,
  );
  const [isDelaying, setIsDelaying] = useState(false);
  const [message, setMessage] = useState("");

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
    setMessage("");
  }

  function handleCardClick(index: number) {
    if (boardDisabled) return;

    const clickedValue = cards[index];
    if (clickedValue === null) return;

    if (selectedFirstIndex === null) {
      onFirstSelection();
      setSelectedFirstIndex(index);
      setMessage("");
      return;
    }

    if (selectedFirstIndex === index) {
      setSelectedFirstIndex(null);
      setSelectedOperation(null);
      setMessage("");
      return;
    }

    if (selectedOperation === null) {
      setSelectedFirstIndex(index);
      setMessage("");
      return;
    }

    const firstValue = cards[selectedFirstIndex];
    if (firstValue === null) return;

    const result = applyOperation(firstValue, clickedValue, selectedOperation);
    if (result === null) {
      setMessage(INVALID_MOVE_MESSAGE);
      return;
    }

    const nextCards = [...cards];
    nextCards[selectedFirstIndex] = null;
    nextCards[index] = result;

    onCardsChange(nextCards);
    setSelectedFirstIndex(index);
    setSelectedOperation(null);
    setMessage("");

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

  function handleRevealAnswer() {
    if (boardDisabled) return;
    setMessage(getRevealAnswer());
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

      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={onReset} disabled={boardDisabled}>
          Reset
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleRevealAnswer}
          disabled={boardDisabled}
        >
          Reveal answer
        </Button>
      </div>
      {message ? <p className="mt-1 text-destructive">{message}</p> : null}
    </>
  );
}
