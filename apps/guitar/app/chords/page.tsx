import { Music } from "lucide-react";
import { GameCard } from "../components/GameCard";
import {
  OPEN_MAJOR,
  OPEN_MINOR,
  OPEN_SEVENTHS,
  OPEN_COMPLEX,
  BAR_E_SHAPE_MAJOR,
  BAR_E_SHAPE_MINOR,
  BAR_A_SHAPE_MAJOR,
  BAR_A_SHAPE_MINOR,
} from "../components/chords";

interface ChordGroup {
  title: string;
  description: string;
  slug: string;
  section?: string;
  chords: typeof OPEN_MAJOR;
}

const GROUPS: ChordGroup[] = [
  { title: "Open Major", description: "C, A, G, E, D — the five essential open major chords.", slug: "open-major", section: "Open Chords", chords: OPEN_MAJOR },
  { title: "Open Minor", description: "Am, Em, Dm — essential open minor chords.", slug: "open-minor", section: "Open Chords", chords: OPEN_MINOR },
  { title: "Open 7ths", description: "Dominant 7th, minor 7th, and major 7th chords in open position.", slug: "open-sevenths", section: "Open Chords", chords: OPEN_SEVENTHS },
  { title: "Open Complex", description: "Sus2, sus4, and slash chords in open position.", slug: "open-complex", section: "Open Chords", chords: OPEN_COMPLEX },
  { title: "Bar E-Shape Major", description: "Root on the 6th string. Movable major bar chord shape.", slug: "bar-e-major", section: "Bar Chords", chords: BAR_E_SHAPE_MAJOR },
  { title: "Bar E-Shape Minor", description: "Root on the 6th string. Movable minor bar chord shape.", slug: "bar-e-minor", section: "Bar Chords", chords: BAR_E_SHAPE_MINOR },
  { title: "Bar A-Shape Major", description: "Root on the 5th string. Movable major bar chord shape.", slug: "bar-a-major", section: "Bar Chords", chords: BAR_A_SHAPE_MAJOR },
  { title: "Bar A-Shape Minor", description: "Root on the 5th string. Movable minor bar chord shape.", slug: "bar-a-minor", section: "Bar Chords", chords: BAR_A_SHAPE_MINOR },
];

export default function ChordsHome() {
  const sections = [...new Set(GROUPS.map((g) => g.section))];

  const toModes = (group: ChordGroup) => [
    {
      label: "Learn",
      href: `/chords/learn/${group.slug}`,
      description: `Browse chord shapes.`,
    },
    {
      label: "Quiz",
      href: `/chords/quiz/${group.slug}`,
      description: `Test your knowledge.`,
    },
  ];

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl px-6 pb-8 pt-20 space-y-6 sm:pt-24">
        {sections.map((section) => (
          <div key={section} className="space-y-4">
            <h2 className="text-xl font-heading tracking-tight text-muted-foreground border-b pb-2">
              {section}
            </h2>
            {GROUPS.filter((g) => g.section === section).map((group) => (
              <GameCard
                key={group.slug}
                title={group.title}
                description={group.description}
                icon={Music}
                modes={toModes(group)}
                accentColor="accent"
              />
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}
