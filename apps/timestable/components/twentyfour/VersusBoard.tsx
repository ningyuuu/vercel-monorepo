"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import Board from "@/components/twentyfour/Board";

type ActivePlayer = 1 | 2;

export default function VersusBoard({
  cards,
  disabled,
  onCardsChange,
  onFirstSelection,
  onDealSolved,
  onBoardReset,
  onResetAll,
  playerStateResetKey,
}: {
  cards: Array<number | null>;
  disabled: boolean;
  onCardsChange: (nextCards: Array<number | null>) => void;
  onFirstSelection: () => void;
  onDealSolved: () => void;
  onBoardReset: () => void;
  onResetAll: () => void;
  playerStateResetKey: number;
}) {
  const [activePlayer, setActivePlayer] = useState<ActivePlayer>(1);

  useEffect(() => {
    setActivePlayer(1);
  }, [playerStateResetKey]);

  function selectPlayer(nextPlayer: ActivePlayer) {
    if (nextPlayer === activePlayer || disabled) return;
    setActivePlayer(nextPlayer);
    onBoardReset();
  }

  return (
    <div className="flex w-full items-center justify-center gap-4">
      <Button
        type="button"
        variant={activePlayer === 1 ? "default" : "outline"}
        onClick={() => selectPlayer(1)}
        disabled={disabled}
        className="min-w-24"
      >
        Player 1
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
        className="min-w-24"
      >
        Player 2
      </Button>
    </div>
  );
}
