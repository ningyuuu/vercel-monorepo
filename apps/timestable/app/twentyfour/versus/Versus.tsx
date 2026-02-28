"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@repo/ui/button";
import { find24Expression, generateSolvableDeals } from "@/lib/twentyFour";
import MultiColorProgressBar from "@/components/MultiColorProgressBar";
import BoardControls from "@/components/twentyfour/BoardControls";
import VersusBoard from "@/components/twentyfour/VersusBoard";

type ActivePlayer = 1 | 2;
const TOTAL_DEALS = 10;

export default function Versus({ initialDeals }: { initialDeals: number[][] }) {
  const normalizedDeals = useMemo(
    () =>
      initialDeals.length === TOTAL_DEALS
        ? initialDeals
        : generateSolvableDeals(TOTAL_DEALS),
    [initialDeals],
  );

  const [deals, setDeals] = useState<number[][]>(normalizedDeals);
  const [dealIndex, setDealIndex] = useState(0);
  const [cards, setCards] = useState<Array<number | null>>([
    ...normalizedDeals[0]!,
  ]);
  const [revealedAnswer, setRevealedAnswer] = useState("");
  const [activePlayer, setActivePlayer] = useState<ActivePlayer | null>(null);
  const [dealWinners, setDealWinners] = useState<Array<ActivePlayer | null>>(
    [],
  );

  const gameOver = dealIndex >= TOTAL_DEALS;
  const player1Points = dealWinners.filter((winner) => winner === 1).length;
  const player2Points = dealWinners.filter((winner) => winner === 2).length;
  const winnerMessage =
    player1Points === player2Points
      ? "It's a tie!"
      : `Player ${player1Points > player2Points ? 1 : 2} wins!`;

  function resetDealOnly() {
    if (gameOver) return;
    const currentDeal = deals[dealIndex];
    if (!currentDeal) return;

    setCards([...currentDeal]);
    setRevealedAnswer("");
  }

  function resetDealAndPlayers() {
    resetDealOnly();
    setActivePlayer(null);
  }

  function restartSession() {
    const nextDeals = generateSolvableDeals(TOTAL_DEALS);

    setDeals(nextDeals);
    setDealIndex(0);
    setCards([...nextDeals[0]!]);
    setRevealedAnswer("");
    setActivePlayer(null);
    setDealWinners([]);
  }

  function advanceDeal() {
    const nextIndex = dealIndex + 1;

    if (nextIndex >= TOTAL_DEALS) {
      setDealIndex(TOTAL_DEALS);
      return;
    }

    const nextDeal = deals[nextIndex];
    if (!nextDeal) return;

    setDealIndex(nextIndex);
    setCards([...nextDeal]);
    setRevealedAnswer("");
    setActivePlayer(null);
  }

  function getRevealAnswer() {
    if (gameOver) return "Game is over.";
    const currentDeal = deals[dealIndex];
    if (!currentDeal) return "No answer found.";

    const expression = find24Expression(currentDeal);
    if (!expression) {
      return "No answer found.";
    }

    const pretty = expression.replaceAll("*", " × ").replaceAll("/", " ÷ ");
    return `${pretty} = 24`;
  }

  function handleCardsChange(nextCards: Array<number | null>) {
    setCards(nextCards);
    setRevealedAnswer("");
  }

  function handleRevealAnswer() {
    setRevealedAnswer(getRevealAnswer());
  }

  function handleSelectPlayer(nextPlayer: ActivePlayer) {
    if (gameOver || nextPlayer === activePlayer) return;
    if (activePlayer !== null) {
      resetDealOnly();
    }
    setActivePlayer(nextPlayer);
  }

  function handleDealSolved() {
    if (gameOver) return;

    setDealWinners((prev) => {
      const next = [...prev];
      next[dealIndex] = activePlayer;
      return next;
    });

    advanceDeal();
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Twenty Four - Versus
      </h1>

      <Button asChild variant="outline">
        <Link href="/">Home</Link>
      </Button>

      <div className="w-full max-w-md">
        <div className="mb-2 text-sm text-zinc-700 dark:text-zinc-300">
          Deal {Math.min(dealIndex + 1, TOTAL_DEALS)} / {TOTAL_DEALS}
        </div>
        <MultiColorProgressBar total={TOTAL_DEALS} segments={dealWinners} />
      </div>

      <VersusBoard
        cards={cards}
        disabled={gameOver}
        onCardsChange={handleCardsChange}
        onFirstSelection={() => {}}
        onDealSolved={handleDealSolved}
        activePlayer={activePlayer}
        onSelectPlayer={handleSelectPlayer}
        onResetAll={resetDealAndPlayers}
      />

      <BoardControls
        disabled={gameOver}
        onReset={resetDealAndPlayers}
        onRevealAnswer={handleRevealAnswer}
        revealMessage={revealedAnswer}
      />

      {gameOver && (
        <p className="text-center text-sm font-medium text-foreground">
          Game over. Player 1: {player1Points} points, Player 2: {player2Points}{" "}
          points. {winnerMessage}
        </p>
      )}

      {gameOver ? (
        <div className="flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={restartSession}>
            Restart
          </Button>
        </div>
      ) : null}
    </div>
  );
}
