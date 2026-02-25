import Practice from "@/components/twentyfour/Practice";
import { generateSolvableDeals } from "@/lib/twentyFour";

export default function TwentyFourPracticePage() {
  const initialDeals = generateSolvableDeals(10);

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-4xl bg-white px-4 py-16 dark:bg-black sm:px-8">
        <Practice initialDeals={initialDeals} />
      </main>
    </div>
  );
}
