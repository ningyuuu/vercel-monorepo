import { Guitar } from "lucide-react";
import { GameCard } from "./components/GameCard";
import {
  LEARN,
  RECALL,
  SWEEPS,
  SINGLE_FRETS,
  GROUPS,
} from "./components/levels";

export default function Home() {
  const toModes = (levels: typeof LEARN, prefix: string) =>
    levels.map((level) => ({
      label: level.name,
      href: `/${prefix}/${level.slug}`,
      description: level.description,
    }));

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl px-6 pb-8 pt-20 space-y-6 sm:pt-24">
        <GameCard
          title="Learn"
          description="Sweep all strings with notes visible."
          icon={Guitar}
          modes={toModes(LEARN, "learn")}
          accentColor="primary"
        />
        <GameCard
          title="Recall"
          description="Learn then recall — notes hidden on second pass."
          icon={Guitar}
          modes={toModes(RECALL, "recall")}
          accentColor="primary"
        />
        <GameCard
          title="Practice"
          description="Play all 6 strings across a fret."
          icon={Guitar}
          modes={toModes(SWEEPS, "practice")}
          accentColor="primary"
        />
        <GameCard
          title="Single Frets"
          description="Quiz on individual frets."
          icon={Guitar}
          modes={toModes(SINGLE_FRETS, "single-frets")}
          accentColor="primary"
        />
        <GameCard
          title="Groups"
          description="Quiz a mix of multiple frets."
          icon={Guitar}
          modes={toModes(GROUPS, "groups")}
          accentColor="primary"
        />
      </main>
    </div>
  );
}
