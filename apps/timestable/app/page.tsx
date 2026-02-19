import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-6xl py-16 px-8 bg-white dark:bg-black">
        <h1 className="text-2xl font-bold mb-4">Timestable</h1>
        <p className="mb-6">Choose a difficulty</p>
        <Link
          href="/easy"
          className="rounded-md bg-blue-600 text-white px-4 py-2"
        >
          Easy
        </Link>
      </main>
    </div>
  );
}
