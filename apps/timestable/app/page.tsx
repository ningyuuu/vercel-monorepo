import Image from "next/image";
import TimestableQuiz from "../components/TimestableQuiz";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-6xl py-16 px-8 bg-white dark:bg-black">
        <div className="mb-6">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
        </div>

        <TimestableQuiz />
      </main>
    </div>
  );
}
