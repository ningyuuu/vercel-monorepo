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
      <div ref={boardContainerRef} className="relative w-full max-w-md">
        <Button
          type="button"
          variant={activePlayer === 1 ? "default" : "outline"}
          onClick={() => selectPlayer(1)}
          disabled={disabled}
          className="absolute left-0 top-0 w-14 -translate-x-[calc(100%+0.75rem)] px-0"
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
            disabled={disabled}
            onCardsChange={onCardsChange}
            onFirstSelection={onFirstSelection}
            onDealSolved={onDealSolved}
            onReset={onResetAll}
          />
        </div>

        <Button
          type="button"
          variant={activePlayer === 2 ? "default" : "outline"}
          onClick={() => selectPlayer(2)}
          disabled={disabled}
          className="absolute right-0 top-0 w-14 translate-x-[calc(100%+0.75rem)] px-0"
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
