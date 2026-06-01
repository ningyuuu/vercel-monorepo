import { notFound } from "next/navigation";
import NoteQuiz from "../../components/NoteQuiz";
import StringSweepQuiz from "../../components/StringSweepQuiz";
import RecallQuiz from "../../components/RecallQuiz";
import { LEARN, RECALL, SWEEPS, SINGLE_FRETS, GROUPS } from "../../components/levels";
import type { Level } from "../../components/levels";

const CATEGORIES: Record<string, Level[]> = {
  learn: LEARN,
  recall: RECALL,
  practice: SWEEPS,
  "single-frets": SINGLE_FRETS,
  groups: GROUPS,
};

export default async function CategoryStagePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const levels = CATEGORIES[category];
  if (!levels) notFound();

  const level = levels.find((l) => l.slug === slug);
  if (!level) notFound();

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-6xl bg-transparent px-4 pb-8 pt-20 space-y-6 sm:px-6 sm:pt-24">
        {level.mode === "recall" ? (
          <RecallQuiz level={level} />
        ) : level.mode === "sweep" || level.mode === "learn" ? (
          <StringSweepQuiz level={level} />
        ) : (
          <NoteQuiz level={level} />
        )}
      </main>
    </div>
  );
}
