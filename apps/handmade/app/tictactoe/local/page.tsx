"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Board, useBoardState } from "../Board";

export default function Home() {
  const [state, setState] = useBoardState();
  const updateState = (index: number) => {
    setState((prevState) => {
      const newState = [...prevState];
      newState[index] = newState[index] === 0 ? 1 : 0; // Toggle between X and O
      return newState as typeof prevState;
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
            <Board state={state} updateState={updateState} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
