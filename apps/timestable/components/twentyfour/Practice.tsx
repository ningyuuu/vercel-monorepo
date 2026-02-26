"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@repo/ui/button";
import { find24Expression, generateSolvableDeals } from "@/lib/twentyFour";
import { useTimer } from "@/components/Timer";
import Board from "@/components/twentyfour/Board";
import SessionStats from "@/components/twentyfour/SessionStats";

const TOTAL_DEALS = 10;

export default function Practice({
  initialDeals,
}: {
  initialDeals: number[][];
}) {
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
  const [boardVersion, setBoardVersion] = useState(0);
  const [hasStartedSession, setHasStartedSession] = useState(false);
  const timerState = useTimer();

  const gameOver = dealIndex >= TOTAL_DEALS;
  const completedDeals = gameOver ? TOTAL_DEALS : dealIndex;
  function resetDeal() {
    if (gameOver) return;
    const currentDeal = deals[dealIndex];
    if (!currentDeal) return;

    setCards([...currentDeal]);
    setBoardVersion((version) => version + 1);
  }

  function restartSession() {
    const nextDeals = generateSolvableDeals(TOTAL_DEALS);

    setDeals(nextDeals);
    setDealIndex(0);
    setCards([...nextDeals[0]!]);
    setBoardVersion((version) => version + 1);
    setHasStartedSession(false);
    timerState.reset();
  }

  function startTimerIfNeeded() {
    if (hasStartedSession) return;
    setHasStartedSession(true);
    timerState.start();
  }

  function advanceDeal() {
    const nextIndex = dealIndex + 1;

    if (nextIndex >= TOTAL_DEALS) {
      setDealIndex(TOTAL_DEALS);
      timerState.stop();
      return;
    }

    const nextDeal = deals[nextIndex];
    if (!nextDeal) return;

    setDealIndex(nextIndex);
    setCards([...nextDeal]);
    setBoardVersion((version) => version + 1);
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

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Twenty Four - Practice
      </h1>

      <SessionStats
        dealIndex={gameOver ? TOTAL_DEALS - 1 : dealIndex}
        totalDeals={TOTAL_DEALS}
        completedDeals={completedDeals}
        timerState={timerState}
      />

      <Board
        key={boardVersion}
        cards={cards}
        disabled={gameOver}
        onCardsChange={setCards}
        onFirstSelection={startTimerIfNeeded}
        onDealSolved={advanceDeal}
        getRevealAnswer={getRevealAnswer}
        onReset={resetDeal}
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
