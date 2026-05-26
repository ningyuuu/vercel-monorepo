import { Guitar } from "lucide-react";
import { GameCard } from "./components/GameCard";
import { LEVELS } from "./components/levels";

export default function Home() {
  const stages = LEVELS.map((level) => ({
    label: level.name,
    href: `/stage/${level.id}`,
    description: level.description,
  }));

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="w-full max-w-4xl py-20 px-6 bg-transparent space-y-6">
        <GameCard
          title="Guitar Note Quiz"
          description="Guess the note for each highlighted fret position."
          icon={Guitar}
          modes={stages}
          accentColor="primary"
        />
      </main>
    </div>
  );
}
