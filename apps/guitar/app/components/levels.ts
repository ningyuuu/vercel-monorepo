export interface Level {
  id: number;
  name: string;
  description: string;
  allowedFrets: number[];
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Open Strings",
    description: "Master the open strings first.",
    allowedFrets: [0],
  },
  {
    id: 2,
    name: "Natural Harmonics",
    description: "Frets 0, 3, 5, and 7.",
    allowedFrets: [0, 3, 5, 7],
  },
  {
    id: 3,
    name: "First Position",
    description: "All frets from 0 to 7.",
    allowedFrets: [0, 1, 2, 3, 4, 5, 6, 7],
  },
];
