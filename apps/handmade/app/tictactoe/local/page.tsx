"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Board, useBoardState, printState, checkWin } from "../Board";

export default function Home() {
  const { state, setState, winState, setWinState } = useBoardState();
  const [current, setCurrent] = useState(1);
  const updateState = (index: number) => {
    setState((prevState) => {
      if (!!winState || prevState[index] !== 0) {
        return prevState;
      }

      const newState = [...prevState] as typeof prevState;
      newState[index] = current as (typeof prevState)[number];
      setCurrent(current === 1 ? 2 : 1);

      setWinState(checkWin(newState));
      return newState;
    });
  };

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
        <Card>
          <CardHeader className="items-center text-left">
            <CardTitle className="text-3xl">Local</CardTitle>
            <p className="text-muted-foreground">
              Two players take turns on the same local device.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {winState ? (
              <p>{printState[winState]} wins!</p>
            ) : (
              <p>{printState[current]}&apos;s turn</p>
            )}
            <Board state={state} updateState={updateState} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
