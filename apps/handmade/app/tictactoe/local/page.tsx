"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Board, useBoardState, printState } from "../Board";

export default function Home() {
  const { state, current, winState, play } = useBoardState();

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
            <Board state={state} play={play} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
