import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { ChordLearn } from "../../../components/ChordLearn";
import {
  OPEN_MAJOR, OPEN_MINOR, OPEN_SEVENTHS, OPEN_COMPLEX,
  BAR_E_SHAPE_MAJOR, BAR_E_SHAPE_MINOR, BAR_A_SHAPE_MAJOR, BAR_A_SHAPE_MINOR,
} from "../../../components/chords";

const GROUPS: Record<string, { title: string; chords: typeof OPEN_MAJOR }> = {
  "open-major": { title: "Open Major Chords", chords: OPEN_MAJOR },
  "open-minor": { title: "Open Minor Chords", chords: OPEN_MINOR },
  "open-sevenths": { title: "Open 7th Chords", chords: OPEN_SEVENTHS },
  "open-complex": { title: "Complex Open Chords", chords: OPEN_COMPLEX },
  "bar-e-major": { title: "Bar E-Shape Major", chords: BAR_E_SHAPE_MAJOR },
  "bar-e-minor": { title: "Bar E-Shape Minor", chords: BAR_E_SHAPE_MINOR },
  "bar-a-major": { title: "Bar A-Shape Major", chords: BAR_A_SHAPE_MAJOR },
  "bar-a-minor": { title: "Bar A-Shape Minor", chords: BAR_A_SHAPE_MINOR },
};

export default async function ChordLearnPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const { group } = await params;
  const g = GROUPS[group];
  if (!g) notFound();

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-5xl px-4 pb-8 pt-20 space-y-6 sm:px-6 sm:pt-24">
        <div className="flex items-center justify-between">
          <Button size="sm" variant="ghost" asChild>
            <Link href="/chords">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/chords/quiz/${group}`}>
              <Play className="size-4" />
              Quiz me
            </Link>
          </Button>
        </div>

        <ChordLearn chords={g.chords} title={g.title} />
      </main>
    </div>
  );
}
