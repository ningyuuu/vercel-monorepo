import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
        <Link href="/tictactoe">
          <Card>
            <CardHeader className="items-center text-left">
              <CardTitle className="text-3xl">Handmade</CardTitle>
              <p className="text-muted-foreground">
                Games and apps made by hand without the use of AI.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">Tic Tac Toe</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    A simple Tic Tac Toe game
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </Link>
      </main>
    </div>
  );
}
