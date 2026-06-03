import { Music } from "lucide-react";
import { GameCard } from "../components/GameCard";
import { OPEN_MAJOR, OPEN_MINOR, OPEN_SEVENTHS, OPEN_COMPLEX } from "../components/chords";

interface ChordGroup {
  title: string;
  description: string;
  slug: string;
  chords: typeof OPEN_MAJOR;
}

const GROUPS: ChordGroup[] = [
  { title: "Open Major", description: "C, A, G, E, D — the five essential open major chords.", slug: "open-major", chords: OPEN_MAJOR },
  { title: "Open Minor", description: "Am, Em, Dm — essential open minor chords.", slug: "open-minor", chords: OPEN_MINOR },
  { title: "Open 7ths", description: "Dominant 7th, minor 7th, and major 7th chords in open position.", slug: "open-sevenths", chords: OPEN_SEVENTHS },
  { title: "Open Complex", description: "Sus2, sus4, and slash chords in open position.", slug: "open-complex", chords: OPEN_COMPLEX },
];

export default function OpenChordsPage() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl px-6 pb-8 pt-20 space-y-6 sm:pt-24">
        {GROUPS.map((group) => (
          <GameCard
            key={group.slug}
            title={group.title}
            description={group.description}
            icon={Music}
            modes={[
              { label: "Learn", href: `/chords/learn/${group.slug}`, description: "Browse chord shapes." },
              { label: "Quiz", href: `/chords/quiz/${group.slug}`, description: "Test your knowledge." },
            ]}
            accentColor="accent"
          />
        ))}
      </main>
    </div>
  );
}
