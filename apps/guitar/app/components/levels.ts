export type GameMode = "random" | "sweep" | "learn" | "recall" | "chord";

import type { ChordDef } from "./chords";

export interface Level {
  slug: string;
  name: string;
  description: string;
  allowedFrets: number[];
  mode: GameMode;
  chords?: ChordDef[];
}

export function makeChordLevel(
  slug: string,
  name: string,
  description: string,
  chords: ChordDef[],
): Level {
  return { slug, name, description, allowedFrets: [], mode: "chord", chords };
}
