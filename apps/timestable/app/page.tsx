import { Calculator } from "lucide-react";
import { GameCard } from "@/components/GameCard";

export default function Home() {
  const multiplicationModes = [
    {
      label: "Easy",
      href: "/multiplication/easy",
      description: "1-9 x 1-9",
    },
    {
      label: "Medium",
      href: "/multiplication/medium",
      description: "1-9 x 11-19",
    },
    {
      label: "Hard",
      href: "/multiplication/hard",
      description: "11-19 x 11-19",
    },
    {
      label: "Extreme",
      href: "/multiplication/extreme",
      description: "11-99 x 11-99",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="w-full max-w-4xl py-20 px-6 bg-transparent">
        <GameCard
          title="Multiplication"
          description="Test your multiplication speed and accuracy across difficulty levels."
          icon={Calculator}
          modes={multiplicationModes}
          accentColor="primary"
        />
      </main>
    </div>
  );
}
