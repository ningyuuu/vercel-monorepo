import TimestableQuiz from "@/components/TimestableQuiz";

export default function Hard() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-6xl bg-white px-3 py-16 dark:bg-black sm:px-8">
        <TimestableQuiz
          firstDigitRange={{ min: 11, max: 19 }}
          secondDigitRange={{ min: 11, max: 19 }}
        />
      </main>
    </div>
  );
}
