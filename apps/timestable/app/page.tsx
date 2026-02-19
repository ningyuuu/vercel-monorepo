import Image from "next/image";
import TimestableQuiz from "../components/TimestableQuiz";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-6xl py-16 px-8 bg-white dark:bg-black">
        <TimestableQuiz />
      </main>
    </div>
  );
}
