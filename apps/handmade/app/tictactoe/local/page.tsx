import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import Link from "next/link";
import { Board, useBoardState } from "../Board";

export default function Home() {
  const state = useBoardState();
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
        <Link href="/tictactoe">
          <Card>
            <CardHeader className="items-center text-left">
              <CardTitle className="text-3xl">Local</CardTitle>
              <p className="text-muted-foreground">
                Two players take turns on the same local device.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Board state={state} />
            </CardContent>
          </Card>
        </Link>
      </main>
    </div>
  );
}
