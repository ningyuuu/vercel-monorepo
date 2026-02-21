import { Calculator } from "lucide-react";
import { GameCard } from "../components/GameCard";

export default function Home() {
  const multiplicationModes = [
    {
      label: "Easy",
      href: "/easy",
      description: "Numbers 1-9",
    },
    {
      label: "Medium",
      href: "/medium",
      description: "single digit x 11 - 19",
    },
    // {
    //   label: "Hard",
    //   href: "/hard",
    //   description: "Numbers 1-20",
    // },
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
