"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@repo/ui/button";
import Board from "@/components/twentyfour/Board";
type ActivePlayer = 1 | 2;

export default function VersusBoard({
  cards,
  disabled,
  onCardsChange,
  onFirstSelection,
  onDealSolved,
  activePlayer,
  onSelectPlayer,
  onResetAll,
}: {
  cards: Array<number | null>;
  disabled: boolean;
  onCardsChange: (nextCards: Array<number | null>) => void;
  onFirstSelection: () => void;
  onDealSolved: () => void;
  activePlayer: ActivePlayer | null;
  onSelectPlayer: (nextPlayer: ActivePlayer) => void;
  onResetAll: () => void;
}) {
  function selectPlayer(nextPlayer: ActivePlayer) {
    if (nextPlayer === activePlayer || disabled) return;
    onSelectPlayer(nextPlayer);
  }

  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const [cardsGridHeight, setCardsGridHeight] = useState<number | null>(null);

  useEffect(() => {
    const container = boardContainerRef.current;
    if (!container) return;

    const cardsGrid = container.querySelector<HTMLDivElement>(
      ".grid.w-full.max-w-md.grid-cols-2.gap-4",
    );
    if (!cardsGrid) return;

    const observer = new ResizeObserver((entries) => {
      const nextHeight = entries[0]?.contentRect.height;
      if (!nextHeight) return;
      setCardsGridHeight(nextHeight);
    });

    observer.observe(cardsGrid);
    setCardsGridHeight(cardsGrid.getBoundingClientRect().height);

    return () => {
      observer.disconnect();
    };
  }, [cards]);

  return (
    <div className="flex w-full justify-center">
      <div
        ref={boardContainerRef}
        className="relative w-[calc(100%-6.5rem)] max-w-md sm:w-full"
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => selectPlayer(1)}
          disabled={disabled}
          className={`absolute left-0 top-0 w-10 -translate-x-[calc(100%+0.75rem)] px-0 sm:w-14 ${
            activePlayer === 1
              ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-500"
              : "border-white/70 bg-black text-white hover:bg-black dark:border-white/70 dark:bg-black dark:text-white dark:hover:bg-black"
          }`}
          style={
            cardsGridHeight ? { height: `${cardsGridHeight}px` } : undefined
          }
        >
          <span className="leading-none text-center whitespace-pre-line">
            {"P\nl\na\ny\ne\nr\n\n1"}
          </span>
        </Button>

        <div className="flex flex-col items-center gap-4">
          <Board
            cards={cards}
            disabled={disabled || activePlayer === null}
            onCardsChange={onCardsChange}
            onFirstSelection={onFirstSelection}
            onDealSolved={onDealSolved}
            onReset={onResetAll}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => selectPlayer(2)}
          disabled={disabled}
          className={`absolute right-0 top-0 w-10 translate-x-[calc(100%+0.75rem)] px-0 sm:w-14 ${
            activePlayer === 2
              ? "border-rose-600 bg-rose-600 text-white hover:bg-rose-600 dark:border-rose-500 dark:bg-rose-500 dark:hover:bg-rose-500"
              : "border-white/70 bg-black text-white hover:bg-black dark:border-white/70 dark:bg-black dark:text-white dark:hover:bg-black"
          }`}
          style={
            cardsGridHeight ? { height: `${cardsGridHeight}px` } : undefined
          }
        >
          <span className="leading-none text-center whitespace-pre-line">
            {"P\nl\na\ny\ne\nr\n\n2"}
          </span>
        </Button>
      </div>
    </div>
  );
}
