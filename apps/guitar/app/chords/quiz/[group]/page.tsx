import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { ArrowLeft } from "lucide-react";
import ChordQuiz from "../../../components/ChordQuiz";
import { makeChordLevel } from "../../../components/levels";
import {
  OPEN_MAJOR, OPEN_MINOR, OPEN_SEVENTHS, OPEN_COMPLEX,
  BAR_E_SHAPE_MAJOR, BAR_E_SHAPE_MINOR, BAR_A_SHAPE_MAJOR, BAR_A_SHAPE_MINOR,
} from "../../../components/chords";

const GROUPS: Record<string, { name: string; chords: typeof OPEN_MAJOR }> = {
  "open-major": { name: "Open Major", chords: OPEN_MAJOR },
  "open-minor": { name: "Open Minor", chords: OPEN_MINOR },
  "open-sevenths": { name: "Open 7ths", chords: OPEN_SEVENTHS },
  "open-complex": { name: "Open Complex", chords: OPEN_COMPLEX },
  "bar-e-major": { name: "Bar E-Shape Major", chords: BAR_E_SHAPE_MAJOR },
  "bar-e-minor": { name: "Bar E-Shape Minor", chords: BAR_E_SHAPE_MINOR },
  "bar-a-major": { name: "Bar A-Shape Major", chords: BAR_A_SHAPE_MAJOR },
  "bar-a-minor": { name: "Bar A-Shape Minor", chords: BAR_A_SHAPE_MINOR },
};

export default async function ChordQuizPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const { group } = await params;
  const g = GROUPS[group];
  if (!g) notFound();

  const level = makeChordLevel("quiz", "Quiz", `Identify ${g.name.toLowerCase()} chords.`, g.chords);

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-6xl px-4 pb-8 pt-20 space-y-6 sm:px-6 sm:pt-24">
        <div className="flex items-center justify-between">
          <Button size="sm" variant="ghost" asChild>
            <Link href="/chords">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/chords/learn/${group}`}>
              Learn
            </Link>
          </Button>
        </div>

        <ChordQuiz level={level} />
      </main>
    </div>
  );
}
