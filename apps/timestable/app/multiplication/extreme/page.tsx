import TimestableQuiz from "@/components/multiplication/TimestableQuiz";

export default function Extreme() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-6xl bg-white px-3 py-16 dark:bg-black sm:px-8">
        <TimestableQuiz
          firstDigitRange={{ min: 11, max: 99 }}
          secondDigitRange={{ min: 11, max: 99 }}
        />
      </main>
    </div>
  );
}
