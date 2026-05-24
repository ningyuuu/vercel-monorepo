import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Fretboard } from "./components/Fretboard";

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-6xl bg-transparent px-4 pb-8 pt-20 space-y-6 sm:px-6 sm:pt-24">
        <Card>
          <CardHeader>
            <CardTitle>Guitar</CardTitle>
            <CardDescription>
              Interactive fretboard — 6 strings, 19 frets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Fretboard />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
