import { STRINGS, getNoteName } from "@/app/components/Fretboard";
import type { StringFocus, NoteFilter } from "./curriculum";

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

function getStringIndices(focus: StringFocus): number[] {
  if (focus === "high") return [0, 1, 2]; // e, B, G
  if (focus === "low") return [3, 4, 5];  // D, A, E
  return [0, 1, 2, 3, 4, 5];
}

function noteMatches(note: string, filter: NoteFilter): boolean {
  if (filter === "natural") return !note.includes("#");
  return true;
}

export function generateQuestions(
  count = 10,
  allowedFrets: number[],
  stringFocus: StringFocus = "all",
  noteFilter: NoteFilter = "all",
): Question[] {
  const stringIndices = getStringIndices(stringFocus);
  const all: Question[] = [];
  for (const stringIndex of stringIndices) {
    for (const fret of allowedFrets) {
      const note = getNoteName(STRINGS[stringIndex]!.note, fret);
      if (!noteMatches(note, noteFilter)) continue;
      all.push({ stringIndex, fret, note });
    }
  }

  if (all.length === 0) return [];

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

export function generateSweepQuestions(
  allowedFrets: number[],
  stringFocus: StringFocus = "all",
  noteFilter: NoteFilter = "all",
): Question[] {
  const stringIndices = getStringIndices(stringFocus);
  const sortedFrets = [...allowedFrets].sort((a, b) => a - b);
  const result: Question[] = [];
  for (const fret of sortedFrets) {
    for (let i = 0; i < stringIndices.length; i++) {
      const si = stringIndices[stringIndices.length - 1 - i]!;
      const string = STRINGS[si]!;
      const note = getNoteName(string.note, fret);
      if (!noteMatches(note, noteFilter)) continue;
      result.push({
        stringIndex: si,
        fret,
        note: getNoteName(string.note, fret),
      });
    }
  }
  return result;
}
