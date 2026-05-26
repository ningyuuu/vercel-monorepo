export type GameMode = "random" | "sweep";

export interface Level {
  id: number;
  name: string;
  description: string;
  allowedFrets: number[];
  mode: GameMode;
}

export const SINGLE_FRETS: Level[] = [
  {
    id: 1,
    name: "Fret 0",
    description: "Open strings only.",
    allowedFrets: [0],
    mode: "random",
  },
  {
    id: 2,
    name: "Fret 3",
    description: "Fret 3 only.",
    allowedFrets: [3],
    mode: "random",
  },
  {
    id: 3,
    name: "Fret 5",
    description: "Fret 5 only.",
    allowedFrets: [5],
    mode: "random",
  },
  {
    id: 4,
    name: "Fret 7",
    description: "Fret 7 only.",
    allowedFrets: [7],
    mode: "random",
  },
  {
    id: 5,
    name: "Fret 9",
    description: "Fret 9 only.",
    allowedFrets: [9],
    mode: "random",
  },
];

export const GROUPS: Level[] = [
  {
    id: 6,
    name: "0 – 3",
    description: "Frets 0 to 3.",
    allowedFrets: [0, 1, 2, 3],
    mode: "random",
  },
  {
    id: 7,
    name: "0 – 7",
    description: "Frets 0 to 7.",
    allowedFrets: [0, 1, 2, 3, 4, 5, 6, 7],
    mode: "random",
  },
  {
    id: 8,
    name: "0 – 11",
    description: "Frets 0 to 11.",
    allowedFrets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    mode: "random",
  },
  {
    id: 9,
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
    id: 10,
    name: "Key Frets",
    description: "Sweeps across frets 0, 3, 5, 7, 9.",
    allowedFrets: [0, 3, 5, 7, 9],
    mode: "sweep",
  },
  {
    id: 11,
    name: "0 – 3",
    description: "Sweeps across frets 0 to 3.",
    allowedFrets: [0, 1, 2, 3],
    mode: "sweep",
  },
  {
    id: 12,
    name: "0 – 7",
    description: "Sweeps across frets 0 to 7.",
    allowedFrets: [0, 1, 2, 3, 4, 5, 6, 7],
    mode: "sweep",
  },
  {
    id: 13,
    name: "0 – 12",
    description: "Sweeps across frets 0 to 12.",
    allowedFrets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    mode: "sweep",
  },
  {
    id: 14,
    name: "0 – 19",
    description: "Sweeps across all frets.",
    allowedFrets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    mode: "sweep",
  },
];

export const LEVELS: Level[] = [...SINGLE_FRETS, ...GROUPS, ...SWEEPS];
