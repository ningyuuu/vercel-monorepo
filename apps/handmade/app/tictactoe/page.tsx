import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full  max-w-3xl flex-col gap-6 px-4 py-12">
        <Card>
          <CardHeader className="items-center text-left">
            <CardTitle className="text-3xl">Tic Tac Toe</CardTitle>
            <p className="text-muted-foreground">Simple game of Tic Tac Toe.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-row gap-2">
              <Link href="/tictactoe/local" className="w-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base">Local versus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      2 players on the same screen.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tictactoe/computer" className="w-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Against Computer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Play against a perfect, minimax AI.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Coming soon.
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tictactoe/online" className="w-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base">Online versus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Play against another player online.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Coming soon.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
