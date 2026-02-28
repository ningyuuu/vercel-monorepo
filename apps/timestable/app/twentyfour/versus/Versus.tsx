"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@repo/ui/button";
import { find24Expression, generateSolvableDeals } from "@/lib/twentyFour";
import Progress from "@/components/Progress";
import BoardControls from "@/components/twentyfour/BoardControls";
import VersusBoard from "@/components/twentyfour/VersusBoard";

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
  const [playerStateResetKey, setPlayerStateResetKey] = useState(0);

  const gameOver = dealIndex >= TOTAL_DEALS;
  const completedDeals = gameOver ? TOTAL_DEALS : dealIndex;

  function resetDealOnly() {
    if (gameOver) return;
    const currentDeal = deals[dealIndex];
    if (!currentDeal) return;

    setCards([...currentDeal]);
    setRevealedAnswer("");
  }

  function resetDealAndPlayers() {
    resetDealOnly();
    setPlayerStateResetKey((value) => value + 1);
  }

  function restartSession() {
    const nextDeals = generateSolvableDeals(TOTAL_DEALS);

    setDeals(nextDeals);
    setDealIndex(0);
    setCards([...nextDeals[0]!]);
    setRevealedAnswer("");
    setPlayerStateResetKey((value) => value + 1);
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
    setPlayerStateResetKey((value) => value + 1);
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

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Twenty Four - Versus
      </h1>

      <div className="w-full max-w-md">
        <div className="mb-2 text-sm text-zinc-700 dark:text-zinc-300">
          Deal {Math.min(dealIndex + 1, TOTAL_DEALS)} / {TOTAL_DEALS}
        </div>
        <Progress total={TOTAL_DEALS} filled={completedDeals} />
      </div>

      <VersusBoard
        cards={cards}
        disabled={gameOver}
        onCardsChange={handleCardsChange}
        onFirstSelection={() => {}}
        onDealSolved={advanceDeal}
        onBoardReset={resetDealOnly}
        onResetAll={resetDealAndPlayers}
        playerStateResetKey={playerStateResetKey}
      />

      <BoardControls
        disabled={gameOver}
        onReset={resetDealAndPlayers}
        onRevealAnswer={handleRevealAnswer}
        revealMessage={revealedAnswer}
      />

      {gameOver && (
        <p className="text-center text-sm font-medium text-foreground">
          All {TOTAL_DEALS} deals completed. Choose Restart or Home.
        </p>
      )}

      {gameOver ? (
        <div className="flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={restartSession}>
            Restart
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
