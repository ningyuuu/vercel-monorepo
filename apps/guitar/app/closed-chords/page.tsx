import { Music } from "lucide-react";
import { GameCard } from "../components/GameCard";
import { BAR_E_SHAPE_MAJOR, BAR_E_SHAPE_MINOR, BAR_A_SHAPE_MAJOR, BAR_A_SHAPE_MINOR } from "../components/chords";

interface ChordGroup {
  title: string;
  description: string;
  slug: string;
  chords: typeof BAR_E_SHAPE_MAJOR;
}

const GROUPS: ChordGroup[] = [
  { title: "E-Shape Major", description: "Root on the 6th string. Movable major shape.", slug: "bar-e-major", chords: BAR_E_SHAPE_MAJOR },
  { title: "E-Shape Minor", description: "Root on the 6th string. Movable minor shape.", slug: "bar-e-minor", chords: BAR_E_SHAPE_MINOR },
  { title: "A-Shape Major", description: "Root on the 5th string. Movable major shape.", slug: "bar-a-major", chords: BAR_A_SHAPE_MAJOR },
  { title: "A-Shape Minor", description: "Root on the 5th string. Movable minor shape.", slug: "bar-a-minor", chords: BAR_A_SHAPE_MINOR },
];

export default function ClosedChordsPage() {
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
