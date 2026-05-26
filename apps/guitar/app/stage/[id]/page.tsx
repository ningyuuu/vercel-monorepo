import { notFound } from "next/navigation";
import NoteQuiz from "../../components/NoteQuiz";
import { LEVELS } from "../../components/levels";

export default async function StagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const level = LEVELS.find((l) => l.id === parseInt(id, 10));
  if (!level) notFound();

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-6xl bg-transparent px-4 pb-8 pt-20 space-y-6 sm:px-6 sm:pt-24">
        <NoteQuiz level={level} />
      </main>
    </div>
  );
}
