import { Guitar } from "lucide-react";
import { GameCard } from "./components/GameCard";
import { LEARN, RECALL, SWEEPS, SINGLE_FRETS, GROUPS } from "./components/levels";

export default function Home() {
  const toModes = (levels: typeof LEARN) =>
    levels.map((level) => ({
      label: level.name,
      href: `/stage/${level.id}`,
      description: level.description,
    }));

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl px-6 pb-8 pt-20 space-y-6 sm:pt-24">
        <GameCard
          title="Learn"
          description="Sweep all strings with notes visible."
          icon={Guitar}
          modes={toModes(LEARN)}
          accentColor="primary"
        />
        <GameCard
          title="Recall"
          description="Learn then recall — notes hidden on second pass."
          icon={Guitar}
          modes={toModes(RECALL)}
          accentColor="primary"
        />
        <GameCard
          title="Practice"
          description="Play all 6 strings across a fret."
          icon={Guitar}
          modes={toModes(SWEEPS)}
          accentColor="primary"
        />
        <GameCard
          title="Single Frets"
          description="Practice one fret at a time."
          icon={Guitar}
          modes={toModes(SINGLE_FRETS)}
          accentColor="primary"
        />
        <GameCard
          title="Groups"
          description="Mix multiple frets together."
          icon={Guitar}
          modes={toModes(GROUPS)}
          accentColor="primary"
        />
      </main>
    </div>
  );
}
