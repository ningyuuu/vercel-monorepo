"use client";
import { Board, useBoardState, printState } from "../Board";

export function Client() {
  const { state, current, winState, play } = useBoardState();

  return (
    <div className="min-h-screen">
      {winState ? (
        <p>{printState[winState]} wins!</p>
      ) : (
        <p>{printState[current]}&apos;s turn</p>
      )}
      <Board state={state} play={play} />
    </div>
  );
}
