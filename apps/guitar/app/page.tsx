import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import NoteQuiz from "./components/NoteQuiz";

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-6xl bg-transparent px-4 pb-8 pt-20 space-y-6 sm:px-6 sm:pt-24">
        <Card>
          <CardHeader>
            <CardTitle>Guitar Note Quiz</CardTitle>
            <CardDescription>
              Guess the note for each highlighted fret position.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NoteQuiz />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
