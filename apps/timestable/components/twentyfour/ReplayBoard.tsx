"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@repo/ui/button";
import { formatCardValue, type DealAction, type Operation } from "@/lib/twentyFour";

const OPERATIONS: Operation[] = ["+", "-", "*", "/"];
const OPERATION_LABELS: Record<Operation, string> = {
  "+": "＋",
  "-": "−",
  "*": "×",
  "/": "÷",
};

const CARD_SHORTCUT_LABELS = ["Q", "W", "A", "S"] as const;
const CARD_SHORTCUT_POSITIONS = [
  "left-2 top-2",
  "right-2 top-2",
  "left-2 bottom-2",
  "right-2 bottom-2",
] as const;

const REPLAY_STEP_MS = 500;

type ReplayBoardProps = {
  initialCards: number[];
  actions: DealAction[];
  runId: number;
};

export default function ReplayBoard({
  initialCards,
  actions,
  runId,
}: ReplayBoardProps) {
  const [cards, setCards] = useState<Array<number | null>>(initialCards);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [activeOperation, setActiveOperation] = useState<Operation | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    timeoutsRef.current.forEach((timeout) => {
      window.clearTimeout(timeout);
    });
    timeoutsRef.current = [];

    const workingCards: Array<number | null> = [...initialCards];

    actions.forEach((action, moveIndex) => {
      const baseDelay = moveIndex * REPLAY_STEP_MS * 4;

      timeoutsRef.current.push(
        window.setTimeout(() => {
          setActiveCardIndex(action.firstIndex);
          setActiveOperation(null);
        }, baseDelay),
      );

      timeoutsRef.current.push(
        window.setTimeout(() => {
          setActiveOperation(action.operation);
        }, baseDelay + REPLAY_STEP_MS),
      );

      timeoutsRef.current.push(
        window.setTimeout(() => {
          setActiveCardIndex(action.secondIndex);
        }, baseDelay + REPLAY_STEP_MS * 2),
      );

      timeoutsRef.current.push(
        window.setTimeout(() => {
          workingCards[action.firstIndex] = null;
          workingCards[action.secondIndex] = action.result;
          setCards([...workingCards]);
        }, baseDelay + REPLAY_STEP_MS * 3),
      );
    });

    const doneTimeout = window.setTimeout(() => {
      setActiveCardIndex(null);
      setActiveOperation(null);
    }, actions.length * REPLAY_STEP_MS * 4);

    timeoutsRef.current.push(doneTimeout);

    return () => {
      timeoutsRef.current.forEach((timeout) => {
        window.clearTimeout(timeout);
      });
      timeoutsRef.current = [];
    };
  }, [actions, runId, initialCards]);

  return (
    <>
      <div className="grid w-full max-w-md grid-cols-2 gap-4">
        {cards.map((value, index) => (
          <div
            key={index}
            className={`relative flex aspect-square items-center justify-center rounded-xl border text-3xl font-semibold transition ${
              value === null
                ? "cursor-default border-dashed border-muted-foreground/20 bg-muted/30 text-transparent"
                : activeCardIndex === index
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card"
            }`}
          >
            <span
              className={`pointer-events-none absolute hidden text-xs font-medium text-muted-foreground/80 sm:block ${CARD_SHORTCUT_POSITIONS[index]}`}
            >
              {CARD_SHORTCUT_LABELS[index]}
            </span>
            {value === null ? " " : formatCardValue(value)}
          </div>
        ))}
      </div>

      <div className="grid w-full grid-cols-4 gap-2 sm:gap-3">
        {OPERATIONS.map((op) => (
          <Button
            key={op}
            type="button"
            variant={activeOperation === op ? "default" : "outline"}
            disabled
            className="w-full min-w-0 text-xl"
          >
            {OPERATION_LABELS[op]}
          </Button>
        ))}
      </div>
    </>
  );
}
