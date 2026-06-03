import { STRINGS, getNoteName } from "@/app/components/Fretboard";

export type Question = {
  stringIndex: number;
  fret: number;
  note: string;
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function generateQuestions(
  count = 10,
  allowedFrets: number[],
): Question[] {
  const all: Question[] = [];
  for (const stringIndex of STRINGS.keys()) {
    for (const fret of allowedFrets) {
      const note = getNoteName(STRINGS[stringIndex]!.note, fret);
      all.push({ stringIndex, fret, note });
    }
  }

  const shuffled = shuffleArray(all);

  if (shuffled.length >= count) {
    return shuffled.slice(0, count);
  }

  const result = [...shuffled];
  while (result.length < count) {
    const pick = shuffled[Math.floor(Math.random() * shuffled.length)]!;
    const last = result[result.length - 1];
    if (
      last &&
      last.stringIndex === pick.stringIndex &&
      last.fret === pick.fret
    ) {
      continue;
    }
    result.push(pick);
  }

  return result;
}

export function generateSweepQuestions(allowedFrets: number[]): Question[] {
  const sortedFrets = [...allowedFrets].sort((a, b) => a - b);
  const result: Question[] = [];
  for (const fret of sortedFrets) {
    for (let si = STRINGS.length - 1; si >= 0; si--) {
      const string = STRINGS[si]!;
      result.push({
        stringIndex: si,
        fret,
        note: getNoteName(string.note, fret),
      });
    }
  }
  return result;
}
