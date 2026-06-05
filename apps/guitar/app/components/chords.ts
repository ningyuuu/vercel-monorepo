export interface ChordDef {
  slug: string;
  name: string;
  formula: string;
  positions: { stringIndex: number; fret: number }[];
  muted: number[];
}

export const OPEN_MAJOR: ChordDef[] = [
  {
    slug: "c-major",
    name: "C Major",
    formula: "R · M3 · P5",
    positions: [
      { stringIndex: 4, fret: 3 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 0 },
      { stringIndex: 1, fret: 1 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [5],
  },
  {
    slug: "a-major",
    name: "A Major",
    formula: "R · M3 · P5",
    positions: [
      { stringIndex: 4, fret: 0 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 2 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [5],
  },
  {
    slug: "g-major",
    name: "G Major",
    formula: "R · M3 · P5",
    positions: [
      { stringIndex: 5, fret: 3 },
      { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 0 },
      { stringIndex: 1, fret: 0 },
      { stringIndex: 0, fret: 3 },
    ],
    muted: [],
  },
  {
    slug: "e-major",
    name: "E Major",
    formula: "R · M3 · P5",
    positions: [
      { stringIndex: 5, fret: 0 },
      { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 1 },
      { stringIndex: 1, fret: 0 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [],
  },
  {
    slug: "d-major",
    name: "D Major",
    formula: "R · M3 · P5",
    positions: [
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 3 },
      { stringIndex: 0, fret: 2 },
    ],
    muted: [5, 4],
  },
];

export const OPEN_MINOR: ChordDef[] = [
  {
    slug: "a-minor",
    name: "A Minor",
    formula: "R · m3 · P5",
    positions: [
      { stringIndex: 4, fret: 0 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 1 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [5],
  },
  {
    slug: "e-minor",
    name: "E Minor",
    formula: "R · m3 · P5",
    positions: [
      { stringIndex: 5, fret: 0 },
      { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 0 },
      { stringIndex: 1, fret: 0 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [],
  },
  {
    slug: "d-minor",
    name: "D Minor",
    formula: "R · m3 · P5",
    positions: [
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 3 },
      { stringIndex: 0, fret: 1 },
    ],
    muted: [5, 4],
  },
];

export const OPEN_SEVENTHS: ChordDef[] = [
  {
    slug: "c7",
    name: "C7",
    formula: "R · M3 · P5 · m7",
    positions: [
      { stringIndex: 4, fret: 3 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 3 },
      { stringIndex: 1, fret: 1 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [5],
  },
  {
    slug: "g7",
    name: "G7",
    formula: "R · M3 · P5 · m7",
    positions: [
      { stringIndex: 5, fret: 3 },
      { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 0 },
      { stringIndex: 1, fret: 0 },
      { stringIndex: 0, fret: 1 },
    ],
    muted: [],
  },
  {
    slug: "a7",
    name: "A7",
    formula: "R · M3 · P5 · m7",
    positions: [
      { stringIndex: 4, fret: 0 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 0 },
      { stringIndex: 1, fret: 2 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [5],
  },
  {
    slug: "d7",
    name: "D7",
    formula: "R · M3 · P5 · m7",
    positions: [
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 1 },
      { stringIndex: 0, fret: 2 },
    ],
    muted: [5, 4],
  },
  {
    slug: "e7",
    name: "E7",
    formula: "R · M3 · P5 · m7",
    positions: [
      { stringIndex: 5, fret: 0 },
      { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 1 },
      { stringIndex: 1, fret: 0 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [],
  },
  {
    slug: "b7",
    name: "B7",
    formula: "R · M3 · P5 · m7",
    positions: [
      { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 1 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 0 },
      { stringIndex: 0, fret: 2 },
    ],
    muted: [5],
  },
  {
    slug: "am7",
    name: "Am7",
    formula: "R · m3 · P5 · m7",
    positions: [
      { stringIndex: 4, fret: 0 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 0 },
      { stringIndex: 1, fret: 1 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [5],
  },
  {
    slug: "dm7",
    name: "Dm7",
    formula: "R · m3 · P5 · m7",
    positions: [
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 1 },
      { stringIndex: 0, fret: 1 },
    ],
    muted: [5, 4],
  },
  {
    slug: "em7",
    name: "Em7",
    formula: "R · m3 · P5 · m7",
    positions: [
      { stringIndex: 5, fret: 0 },
      { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 0 },
      { stringIndex: 1, fret: 0 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [],
  },
  {
    slug: "cmaj7",
    name: "Cmaj7",
    formula: "R · M3 · P5 · M7",
    positions: [
      { stringIndex: 4, fret: 3 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 0 },
      { stringIndex: 1, fret: 0 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [5],
  },
  {
    slug: "amaj7",
    name: "Amaj7",
    formula: "R · M3 · P5 · M7",
    positions: [
      { stringIndex: 4, fret: 0 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 1 },
      { stringIndex: 1, fret: 2 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [5],
  },
  {
    slug: "dmaj7",
    name: "Dmaj7",
    formula: "R · M3 · P5 · M7",
    positions: [
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 2 },
      { stringIndex: 0, fret: 2 },
    ],
    muted: [5, 4],
  },
];

export const OPEN_SEVENTHS_I: ChordDef[] = [
  OPEN_SEVENTHS[0]!,  // C7
  OPEN_SEVENTHS[1]!,  // G7
  OPEN_SEVENTHS[3]!,  // D7
  OPEN_SEVENTHS[2]!,  // A7
];
export const OPEN_SEVENTHS_II: ChordDef[] = [
  OPEN_SEVENTHS[4]!,  // E7
  OPEN_SEVENTHS[6]!,  // Am7
  OPEN_SEVENTHS[8]!,  // Em7
  OPEN_SEVENTHS[7]!,  // Dm7
];

export const OPEN_COMPLEX: ChordDef[] = [
  {
    slug: "asus2",
    name: "Asus2",
    formula: "R · M2 · P5",
    positions: [
      { stringIndex: 4, fret: 0 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 0 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [5],
  },
  {
    slug: "asus4",
    name: "Asus4",
    formula: "R · P4 · P5",
    positions: [
      { stringIndex: 4, fret: 0 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 3 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [5],
  },
  {
    slug: "dsus2",
    name: "Dsus2",
    formula: "R · M2 · P5",
    positions: [
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 3 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [5, 4],
  },
  {
    slug: "dsus4",
    name: "Dsus4",
    formula: "R · P4 · P5",
    positions: [
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 3 },
      { stringIndex: 0, fret: 3 },
    ],
    muted: [5, 4],
  },
  {
    slug: "esus4",
    name: "Esus4",
    formula: "R · P4 · P5",
    positions: [
      { stringIndex: 5, fret: 0 },
      { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 0 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [],
  },
  {
    slug: "d-f-sharp",
    name: "D/F#",
    formula: "R · M3 · P5 (F# bass)",
    positions: [
      { stringIndex: 5, fret: 2 },
      { stringIndex: 3, fret: 0 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 3 },
      { stringIndex: 0, fret: 2 },
    ],
    muted: [4],
  },
  {
    slug: "c-g",
    name: "C/G",
    formula: "R · M3 · P5 (G bass)",
    positions: [
      { stringIndex: 5, fret: 3 },
      { stringIndex: 4, fret: 3 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 0 },
      { stringIndex: 1, fret: 1 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [],
  },
  {
    slug: "eslashg",
    name: "E/G#",
    formula: "R · M3 · P5 (G# bass)",
    positions: [
      { stringIndex: 5, fret: 4 },
      { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 2 },
      { stringIndex: 2, fret: 1 },
      { stringIndex: 1, fret: 0 },
      { stringIndex: 0, fret: 0 },
    ],
    muted: [],
  },
];

export const BAR_E_SHAPE_MAJOR: ChordDef[] = [
  {
    slug: "f-major-bar",
    name: "F Major",
    formula: "R · M3 · P5 (E shape, fret 1)",
    positions: [
      { stringIndex: 5, fret: 1 },
      { stringIndex: 4, fret: 3 },
      { stringIndex: 3, fret: 3 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 1 },
      { stringIndex: 0, fret: 1 },
    ],
    muted: [],
  },
  {
    slug: "f-sharp-major-bar",
    name: "F# Major",
    formula: "R · M3 · P5 (E shape, fret 2)",
    positions: [
      { stringIndex: 5, fret: 2 },
      { stringIndex: 4, fret: 4 },
      { stringIndex: 3, fret: 4 },
      { stringIndex: 2, fret: 3 },
      { stringIndex: 1, fret: 2 },
      { stringIndex: 0, fret: 2 },
    ],
    muted: [],
  },
  {
    slug: "g-major-bar",
    name: "G Major",
    formula: "R · M3 · P5 (E shape, fret 3)",
    positions: [
      { stringIndex: 5, fret: 3 },
      { stringIndex: 4, fret: 5 },
      { stringIndex: 3, fret: 5 },
      { stringIndex: 2, fret: 4 },
      { stringIndex: 1, fret: 3 },
      { stringIndex: 0, fret: 3 },
    ],
    muted: [],
  },
  {
    slug: "a-major-bar-5",
    name: "A Major",
    formula: "R · M3 · P5 (E shape, fret 5)",
    positions: [
      { stringIndex: 5, fret: 5 },
      { stringIndex: 4, fret: 7 },
      { stringIndex: 3, fret: 7 },
      { stringIndex: 2, fret: 6 },
      { stringIndex: 1, fret: 5 },
      { stringIndex: 0, fret: 5 },
    ],
    muted: [],
  },
];

export const BAR_E_SHAPE_MINOR: ChordDef[] = [
  {
    slug: "f-minor-bar",
    name: "F Minor",
    formula: "R · m3 · P5 (Em shape, fret 1)",
    positions: [
      { stringIndex: 5, fret: 1 },
      { stringIndex: 4, fret: 3 },
      { stringIndex: 3, fret: 3 },
      { stringIndex: 2, fret: 1 },
      { stringIndex: 1, fret: 1 },
      { stringIndex: 0, fret: 1 },
    ],
    muted: [],
  },
  {
    slug: "f-sharp-minor-bar",
    name: "F# Minor",
    formula: "R · m3 · P5 (Em shape, fret 2)",
    positions: [
      { stringIndex: 5, fret: 2 },
      { stringIndex: 4, fret: 4 },
      { stringIndex: 3, fret: 4 },
      { stringIndex: 2, fret: 2 },
      { stringIndex: 1, fret: 2 },
      { stringIndex: 0, fret: 2 },
    ],
    muted: [],
  },
  {
    slug: "g-minor-bar",
    name: "G Minor",
    formula: "R · m3 · P5 (Em shape, fret 3)",
    positions: [
      { stringIndex: 5, fret: 3 },
      { stringIndex: 4, fret: 5 },
      { stringIndex: 3, fret: 5 },
      { stringIndex: 2, fret: 3 },
      { stringIndex: 1, fret: 3 },
      { stringIndex: 0, fret: 3 },
    ],
    muted: [],
  },
  {
    slug: "g-sharp-minor-bar",
    name: "G# Minor",
    formula: "R · m3 · P5 (Em shape, fret 4)",
    positions: [
      { stringIndex: 5, fret: 4 },
      { stringIndex: 4, fret: 6 },
      { stringIndex: 3, fret: 6 },
      { stringIndex: 2, fret: 4 },
      { stringIndex: 1, fret: 4 },
      { stringIndex: 0, fret: 4 },
    ],
    muted: [],
  },
];

export const BAR_A_SHAPE_MAJOR: ChordDef[] = [
  {
    slug: "b-major-bar",
    name: "B Major",
    formula: "R · M3 · P5 (A shape, fret 2)",
    positions: [
      { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 4 },
      { stringIndex: 2, fret: 4 },
      { stringIndex: 1, fret: 4 },
      { stringIndex: 0, fret: 2 },
    ],
    muted: [5],
  },
  {
    slug: "c-major-bar",
    name: "C Major",
    formula: "R · M3 · P5 (A shape, fret 3)",
    positions: [
      { stringIndex: 4, fret: 3 },
      { stringIndex: 3, fret: 5 },
      { stringIndex: 2, fret: 5 },
      { stringIndex: 1, fret: 5 },
      { stringIndex: 0, fret: 3 },
    ],
    muted: [5],
  },
  {
    slug: "c-sharp-major-bar",
    name: "C# Major",
    formula: "R · M3 · P5 (A shape, fret 4)",
    positions: [
      { stringIndex: 4, fret: 4 },
      { stringIndex: 3, fret: 6 },
      { stringIndex: 2, fret: 6 },
      { stringIndex: 1, fret: 6 },
      { stringIndex: 0, fret: 4 },
    ],
    muted: [5],
  },
  {
    slug: "e-a-shape-7",
    name: "E Major",
    formula: "R · M3 · P5 (A shape, fret 7)",
    positions: [
      { stringIndex: 4, fret: 7 },
      { stringIndex: 3, fret: 9 },
      { stringIndex: 2, fret: 9 },
      { stringIndex: 1, fret: 9 },
      { stringIndex: 0, fret: 7 },
    ],
    muted: [5],
  },
];

export const BAR_A_SHAPE_MINOR: ChordDef[] = [
  {
    slug: "b-minor-bar",
    name: "B Minor",
    formula: "R · m3 · P5 (Am shape, fret 2)",
    positions: [
      { stringIndex: 4, fret: 2 },
      { stringIndex: 3, fret: 4 },
      { stringIndex: 2, fret: 4 },
      { stringIndex: 1, fret: 3 },
      { stringIndex: 0, fret: 2 },
    ],
    muted: [5],
  },
  {
    slug: "c-minor-bar",
    name: "C Minor",
    formula: "R · m3 · P5 (Am shape, fret 3)",
    positions: [
      { stringIndex: 4, fret: 3 },
      { stringIndex: 3, fret: 5 },
      { stringIndex: 2, fret: 5 },
      { stringIndex: 1, fret: 4 },
      { stringIndex: 0, fret: 3 },
    ],
    muted: [5],
  },
];

export const OPEN_MAJOR_I: ChordDef[] = OPEN_MAJOR.slice(0, 3);  // C, A, G
export const OPEN_MAJOR_II: ChordDef[] = OPEN_MAJOR.slice(3, 5); // E, D

export const OPEN_CHORDS_ALL: ChordDef[] = [
  ...OPEN_MAJOR,
  ...OPEN_MINOR,
  ...OPEN_SEVENTHS,
  ...OPEN_COMPLEX,
];

export const BAR_CHORDS_ALL: ChordDef[] = [
  ...BAR_E_SHAPE_MAJOR,
  ...BAR_E_SHAPE_MINOR,
  ...BAR_A_SHAPE_MAJOR,
  ...BAR_A_SHAPE_MINOR,
];

export type ChordGroupKey =
  | "open-major"
  | "open-major-i"
  | "open-major-ii"
  | "open-minor"
  | "open-sevenths"
  | "open-sevenths-i"
  | "open-sevenths-ii"
  | "barre-e-major"
  | "barre-e-minor"
  | "barre-a-major"
  | "barre-a-minor";

export const CHORD_GROUP_MAP: Record<ChordGroupKey, ChordDef[]> = {
  "open-major": OPEN_MAJOR,
  "open-major-i": OPEN_MAJOR_I,
  "open-major-ii": OPEN_MAJOR_II,
  "open-minor": OPEN_MINOR,
  "open-sevenths": OPEN_SEVENTHS,
  "open-sevenths-i": OPEN_SEVENTHS_I,
  "open-sevenths-ii": OPEN_SEVENTHS_II,
  "barre-e-major": BAR_E_SHAPE_MAJOR,
  "barre-e-minor": BAR_E_SHAPE_MINOR,
  "barre-a-major": BAR_A_SHAPE_MAJOR,
  "barre-a-minor": BAR_A_SHAPE_MINOR,
};
