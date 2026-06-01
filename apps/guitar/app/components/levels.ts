export type GameMode = "random" | "sweep" | "learn" | "recall";

export interface Level {
  slug: string;
  name: string;
  description: string;
  allowedFrets: number[];
  mode: GameMode;
}

export const SINGLE_FRETS: Level[] = [
  {
    slug: "0",
    name: "Fret 0",
    description: "Open strings only.",
    allowedFrets: [0],
    mode: "random",
  },
  {
    slug: "3",
    name: "Fret 3",
    description: "Fret 3 only.",
    allowedFrets: [3],
    mode: "random",
  },
  {
    slug: "5",
    name: "Fret 5",
    description: "Fret 5 only.",
    allowedFrets: [5],
    mode: "random",
  },
  {
    slug: "7",
    name: "Fret 7",
    description: "Fret 7 only.",
    allowedFrets: [7],
    mode: "random",
  },
  {
    slug: "9",
    name: "Fret 9",
    description: "Fret 9 only.",
    allowedFrets: [9],
    mode: "random",
  },
];

export const GROUPS: Level[] = [
  {
    slug: "key-frets",
    name: "Key Frets",
    description: "Frets 0, 3, 5, 7, and 9.",
    allowedFrets: [0, 3, 5, 7, 9],
    mode: "random",
  },
  {
    slug: "0-3",
    name: "0 – 3",
    description: "Frets 0 to 3.",
    allowedFrets: [0, 1, 2, 3],
    mode: "random",
  },
  {
    slug: "0-7",
    name: "0 – 7",
    description: "Frets 0 to 7.",
    allowedFrets: [0, 1, 2, 3, 4, 5, 6, 7],
    mode: "random",
  },
  {
    slug: "0-11",
    name: "0 – 11",
    description: "Frets 0 to 11.",
    allowedFrets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    mode: "random",
  },
  {
    slug: "0-19",
    name: "0 – 19",
    description: "All frets.",
    allowedFrets: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    ],
    mode: "random",
  },
];

export const SWEEPS: Level[] = [
  {
    slug: "key-frets",
    name: "Key Frets",
    description: "Sweeps across frets 0, 3, 5, 7, 9.",
    allowedFrets: [0, 3, 5, 7, 9],
    mode: "sweep",
  },
  {
    slug: "0-3",
    name: "0 – 3",
    description: "Sweeps across frets 0 to 3.",
    allowedFrets: [0, 1, 2, 3],
    mode: "sweep",
  },
  {
    slug: "0-7",
    name: "0 – 7",
    description: "Sweeps across frets 0 to 7.",
    allowedFrets: [0, 1, 2, 3, 4, 5, 6, 7],
    mode: "sweep",
  },
  {
    slug: "0-12",
    name: "0 – 12",
    description: "Sweeps across frets 0 to 12.",
    allowedFrets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    mode: "sweep",
  },
  {
    slug: "0-19",
    name: "0 – 19",
    description: "Sweeps across all frets.",
    allowedFrets: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    ],
    mode: "sweep",
  },
];

export const LEARN: Level[] = [
  {
    slug: "key-frets",
    name: "Key Frets",
    description: "Frets 0, 3, 5, 7, 9.",
    allowedFrets: [0, 3, 5, 7, 9],
    mode: "learn",
  },
  {
    slug: "0-3",
    name: "0 – 3",
    description: "Frets 0 to 3.",
    allowedFrets: [0, 1, 2, 3],
    mode: "learn",
  },
  {
    slug: "4-7",
    name: "4 – 7",
    description: "Frets 4 to 7.",
    allowedFrets: [4, 5, 6, 7],
    mode: "learn",
  },
  {
    slug: "8-9",
    name: "8 – 9",
    description: "Frets 8 and 9.",
    allowedFrets: [8, 9],
    mode: "learn",
  },
  {
    slug: "10-12",
    name: "10 – 12",
    description: "Frets 10 to 12.",
    allowedFrets: [10, 11, 12],
    mode: "learn",
  },
];

export const RECALL: Level[] = [
  {
    slug: "key-frets",
    name: "Key Frets",
    description: "Frets 0, 3, 5, 7, 9.",
    allowedFrets: [0, 3, 5, 7, 9],
    mode: "recall",
  },
  {
    slug: "0-3",
    name: "0 – 3",
    description: "Frets 0 to 3.",
    allowedFrets: [0, 1, 2, 3],
    mode: "recall",
  },
  {
    slug: "4-7",
    name: "4 – 7",
    description: "Frets 4 to 7.",
    allowedFrets: [4, 5, 6, 7],
    mode: "recall",
  },
  {
    slug: "8-9",
    name: "8 – 9",
    description: "Frets 8 and 9.",
    allowedFrets: [8, 9],
    mode: "recall",
  },
  {
    slug: "10-12",
    name: "10 – 12",
    description: "Frets 10 to 12.",
    allowedFrets: [10, 11, 12],
    mode: "recall",
  },
];

export const LEVELS: Level[] = [
  ...SINGLE_FRETS,
  ...GROUPS,
  ...SWEEPS,
  ...LEARN,
  ...RECALL,
];
