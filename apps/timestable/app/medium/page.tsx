import TimestableQuiz from "../../components/TimestableQuiz";

export default function Medium() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-6xl py-16 px-8 bg-white dark:bg-black">
        <TimestableQuiz
          firstDigitRange={{ min: 11, max: 19 }}
          secondDigitRange={{ min: 4, max: 9 }}
        />
      </main>
    </div>
  );
}
