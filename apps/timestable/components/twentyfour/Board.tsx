"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@repo/ui/button";
import {
  applyOperation,
  formatCardValue,
  isTwentyFour,
  type Operation,
} from "@/lib/twentyFour";
import { isTypingTarget } from "@/lib/utils";

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

const CARD_SHORTCUTS: { [k: string]: number } = {
  q: 0,
  w: 1,
  a: 2,
  s: 3,
};

const OPERATION_SHORTCUT_LABELS: Record<Operation, string> = {
  "+": "=",
  "-": "-",
  "*": "8",
  "/": "/",
};

const CARD_SHORTCUT_LABELS = ["Q", "W", "A", "S"] as const;
const CARD_SHORTCUT_POSITIONS = [
  "left-2 top-2",
  "right-2 top-2",
  "left-2 bottom-2",
  "right-2 bottom-2",
] as const;

export default function Board({
  cards,
  disabled,
  onCardsChange,
  onFirstSelection,
  onDealSolved,
  onReset,
}: {
  cards: Array<number | null>;
  disabled: boolean;
  onCardsChange: (nextCards: Array<number | null>) => void;
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

  const handleOperationClick = useCallback(
    (op: Operation) => {
      if (selectedFirstIndex === null || boardDisabled) return;
      setSelectedOperation(op);
      setMessage("");
    },
    [selectedFirstIndex, boardDisabled],
  );

  const handleCardClick = useCallback(
    (index: number) => {
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

      const result = applyOperation(
        firstValue,
        clickedValue,
        selectedOperation,
      );
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
    },
    [
      boardDisabled,
      cards,
      selectedFirstIndex,
      selectedOperation,
      onFirstSelection,
      onCardsChange,
      onDealSolved,
    ],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;

      if (event.key === "Backspace") {
        if (boardDisabled) return;
        event.preventDefault();
        onReset();
        return;
      }

      const index = CARD_SHORTCUTS[event.key.toLowerCase()];
      if (index !== undefined) {
        event.preventDefault();
        handleCardClick(index);
        return;
      }

      const operation = OPERATIONS.find(
        (op) => OPERATION_SHORTCUT_LABELS[op] === event.key,
      );
      if (operation === undefined) return;

      event.preventDefault();
      handleOperationClick(operation);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [boardDisabled, handleCardClick, handleOperationClick, onReset]);

  return (
    <>
      <div className="grid w-full max-w-md grid-cols-2 gap-4">
        {cards.map((value, index) => (
          <button
            key={index}
            type="button"
            disabled={value === null || boardDisabled}
            onClick={() => handleCardClick(index)}
            className={`relative aspect-square rounded-xl border text-3xl font-semibold transition ${
              value === null
                ? "cursor-default border-dashed border-muted-foreground/20 bg-muted/30 text-transparent"
                : boardDisabled
                  ? "cursor-not-allowed border-border bg-card"
                  : selectedFirstIndex === index
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            <span
              className={`pointer-events-none absolute hidden text-xs font-medium text-muted-foreground/80 sm:block ${CARD_SHORTCUT_POSITIONS[index]}`}
            >
              {CARD_SHORTCUT_LABELS[index]}
            </span>
            {value === null ? " " : formatCardValue(value)}
          </button>
        ))}
      </div>

      <div className="grid w-full grid-cols-4 gap-2 sm:gap-3">
        {OPERATIONS.map((op) => (
          <Button
            key={op}
            type="button"
            variant={selectedOperation === op ? "default" : "outline"}
            onClick={() => handleOperationClick(op)}
            disabled={boardDisabled}
            title={`shortcut: ${OPERATION_SHORTCUT_LABELS[op]}`}
            className="w-full min-w-0 text-xl"
          >
            {OPERATION_LABELS[op]}
          </Button>
        ))}
      </div>
      {message ? <p className="mt-1 text-destructive">{message}</p> : null}
    </>
  );
}
