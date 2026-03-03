"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@repo/ui/button";
import { find24Expression, generateSolvableDeals } from "@/lib/twentyFour";
import type { DealAction } from "@/lib/twentyFour";
import { useTimer } from "@/components/Timer";
import Board from "@/components/twentyfour/Board";
import ReplayBoard from "@/components/twentyfour/ReplayBoard";
import BoardControls from "@/components/twentyfour/BoardControls";
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

  const initialActionsState = () =>
    Array.from({ length: TOTAL_DEALS }, () => []);

  const [deals, setDeals] = useState<number[][]>(normalizedDeals);
  const [dealIndex, setDealIndex] = useState(0);
  const [cards, setCards] = useState<Array<number | null>>([
    ...normalizedDeals[0]!,
  ]);
  const [revealedAnswer, setRevealedAnswer] = useState("");
  const [boardVersion, setBoardVersion] = useState(0);
  const [hasStartedSession, setHasStartedSession] = useState(false);
  const [actionsByDeal, setActionsByDeal] =
    useState<DealAction[][]>(initialActionsState);
  const [replayDealIndex, setReplayDealIndex] = useState<number | null>(null);
  const [replayRunId, setReplayRunId] = useState(0);
  const timerState = useTimer();

  const gameOver = dealIndex >= TOTAL_DEALS;
  const completedDeals = gameOver ? TOTAL_DEALS : dealIndex;
  const replayState = useMemo(
    () =>
      gameOver && replayDealIndex !== null
        ? {
            runId: replayRunId,
            initialCards: deals[replayDealIndex] ?? [],
            actions: actionsByDeal[replayDealIndex] ?? [],
          }
        : null,
    [gameOver, replayDealIndex, replayRunId, deals, actionsByDeal],
  );

  function resetDeal() {
    if (gameOver) return;
    const currentDeal = deals[dealIndex];
    if (!currentDeal) return;

    setCards([...currentDeal]);
    setRevealedAnswer("");
    setBoardVersion((version) => version + 1);
  }

  function restartSession() {
    const nextDeals = generateSolvableDeals(TOTAL_DEALS);

    setDeals(nextDeals);
    setDealIndex(0);
    setCards([...nextDeals[0]!]);
    setRevealedAnswer("");
    setActionsByDeal(initialActionsState());
    setReplayDealIndex(null);
    setReplayRunId(0);
    setBoardVersion((version) => version + 1);
    setHasStartedSession(false);
    timerState.reset();
  }

  function startTimerIfNeeded() {
    if (hasStartedSession) return;
    setHasStartedSession(true);
    timerState.start();
  }

  function advanceDeal(actions: DealAction[]) {
    setActionsByDeal((prev) => {
      const next = [...prev];
      next[dealIndex] = actions;
      return next;
    });

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
    setRevealedAnswer("");
    setBoardVersion((version) => version + 1);
  }

  function handleCardsChange(nextCards: Array<number | null>) {
    setCards(nextCards);
    setRevealedAnswer("");
  }

  function handleRevealAnswer() {
    setRevealedAnswer(getRevealAnswer());
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

      <Button asChild variant="outline">
        <Link href="/">Home</Link>
      </Button>

      <SessionStats
        dealIndex={gameOver ? TOTAL_DEALS - 1 : dealIndex}
        totalDeals={TOTAL_DEALS}
        completedDeals={completedDeals}
        timerState={timerState}
      />

      {replayState ? (
        <ReplayBoard
          key={`${replayState.runId}-${replayDealIndex}`}
          initialCards={replayState.initialCards}
          actions={replayState.actions}
          runId={replayState.runId}
        />
      ) : (
        <Board
          key={boardVersion}
          cards={cards}
          disabled={gameOver}
          onCardsChange={handleCardsChange}
          onFirstSelection={startTimerIfNeeded}
          onDealSolved={advanceDeal}
          onReset={resetDeal}
        />
      )}

      <BoardControls
        disabled={gameOver}
        onReset={resetDeal}
        onRevealAnswer={handleRevealAnswer}
        revealMessage={revealedAnswer}
      />

      {gameOver && (
        <p className="text-center text-sm font-medium text-foreground">
          Game over. Click a deal to review
        </p>
      )}

      {gameOver ? (
        <div className="flex w-full max-w-md flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {Array.from({ length: TOTAL_DEALS }, (_, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                onClick={() => {
                  setReplayDealIndex(index);
                  setReplayRunId((prev) => prev + 1);
                }}
              >
                Deal {index + 1}
              </Button>
            ))}
          </div>

          <Button type="button" onClick={restartSession}>
            Restart
          </Button>
        </div>
      ) : null}
    </div>
  );
}
