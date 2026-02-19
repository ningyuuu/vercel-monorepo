import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@repo/ui/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl py-16 px-4 bg-transparent">
        <Card className="w-full aspect-square max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Multiplication</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-100 mb-6">
              Test your multiplication speed and accuracy across three
              difficulty levels.
            </p>

            <div className="text-sm text-zinc-100 font-medium mb-2">
              Select Mode
            </div>
            <div className="flex gap-4">
              <Link
                href="/easy"
                className="flex-1 rounded-lg border bg-white dark:bg-zinc-900 px-4 py-3"
              >
                <div className="text-lg font-semibold">Easy</div>
                <div className="text-sm text-zinc-500">Numbers 1-9</div>
              </Link>

              {/* <Link
                href="#"
                className="flex-1 rounded-lg border bg-white/80 dark:bg-zinc-900/80 px-4 py-3 opacity-60 pointer-events-none"
              >
                <div className="text-lg font-semibold">Medium</div>
                <div className="text-sm text-zinc-500">Numbers 1-12</div>
              </Link>

              <Link
                href="#"
                className="flex-1 rounded-lg border bg-white/80 dark:bg-zinc-900/80 px-4 py-3 opacity-60 pointer-events-none"
              >
                <div className="text-lg font-semibold">Hard</div>
                <div className="text-sm text-zinc-500">Numbers 1-20</div>
              </Link> */}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
