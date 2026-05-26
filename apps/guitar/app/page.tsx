import { Guitar } from "lucide-react";
import { GameCard } from "./components/GameCard";
import { SINGLE_FRETS, GROUPS, SWEEPS } from "./components/levels";

export default function Home() {
  const singleFretStages = SINGLE_FRETS.map((level) => ({
    label: level.name,
    href: `/stage/${level.id}`,
    description: level.description,
  }));

  const groupStages = GROUPS.map((level) => ({
    label: level.name,
    href: `/stage/${level.id}`,
    description: level.description,
  }));

  const sweepStages = SWEEPS.map((level) => ({
    label: level.name,
    href: `/stage/${level.id}`,
    description: level.description,
  }));

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="w-full max-w-4xl py-20 px-6 bg-transparent space-y-6">
        <GameCard
          title="Position Sweeps"
          description="Play all 6 strings across a fret."
          icon={Guitar}
          modes={sweepStages}
          accentColor="primary"
        />
        <GameCard
          title="Single Frets"
          description="Practice one fret at a time."
          icon={Guitar}
          modes={singleFretStages}
          accentColor="primary"
        />
        <GameCard
          title="Groups"
          description="Mix multiple frets together."
          icon={Guitar}
          modes={groupStages}
          accentColor="primary"
        />
      </main>
    </div>
  );
}
