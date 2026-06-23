import rawData from "./chords-data.json";

export interface ChordDef {
  slug: string;
  name: string;
  formula: string;
  positions: { stringIndex: number; fret: number }[];
  muted: number[];
}

type RawPos = { idx: number; fret: number };
type RawChord = Omit<ChordDef, "positions"> & { positions: RawPos[] };

function fix(c: RawChord): ChordDef {
  return { ...c, positions: c.positions.map((p) => ({ stringIndex: p.idx, fret: p.fret })) };
}

const data = rawData as Record<string, RawChord[]>;

// ── Source chord arrays ──

const get = (key: string): RawChord[] => data[key]!;

export const OPEN_MAJOR: ChordDef[] = get("OPEN_MAJOR").map(fix);
export const OPEN_MINOR: ChordDef[] = get("OPEN_MINOR").map(fix);
export const OPEN_SEVENTHS: ChordDef[] = get("OPEN_SEVENTHS").map(fix);
export const OPEN_COMPLEX: ChordDef[] = get("OPEN_COMPLEX").map(fix);
export const BAR_E_SHAPE_MAJOR: ChordDef[] = get("BAR_E_SHAPE_MAJOR").map(fix);
export const BAR_E_SHAPE_MINOR: ChordDef[] = get("BAR_E_SHAPE_MINOR").map(fix);
export const BAR_A_SHAPE_MAJOR: ChordDef[] = get("BAR_A_SHAPE_MAJOR").map(fix);
export const BAR_A_SHAPE_MINOR: ChordDef[] = get("BAR_A_SHAPE_MINOR").map(fix);
export const BAR_G_SHAPE_MAJOR: ChordDef[] = get("BAR_G_SHAPE_MAJOR").map(fix);

// ── Derived subsets ──

export const OPEN_MAJOR_I: ChordDef[] = OPEN_MAJOR.slice(0, 3);  // C, A, G
export const OPEN_MAJOR_II: ChordDef[] = OPEN_MAJOR.slice(3, 5); // E, D

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
  ...BAR_G_SHAPE_MAJOR,
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
  | "barre-a-minor"
  | "barre-g-major";

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
  "barre-g-major": BAR_G_SHAPE_MAJOR,
};

// ── Unified chord catalog types ──

export type ChordCategory = "open" | "closed";

export enum ChordType {
  major = "major",
  minor = "minor",
  dom7 = "dom7",
  min7 = "min7",
  maj7 = "maj7",
  sus2 = "sus2",
  sus4 = "sus4",
}

export interface UnifiedChord extends ChordDef {
  category: ChordCategory;
  type: ChordType;
  rootNote: string;
}

// ── Helpers ──

const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

export function parseRootFromName(name: string): string {
  const slashIdx = name.indexOf("/");
  const base = slashIdx !== -1 ? name.slice(0, slashIdx) : name;
  for (const sharp of ["C#", "D#", "F#", "G#", "A#"] as const) {
    if (base.startsWith(sharp)) return sharp;
  }
  for (const note of ["C", "D", "E", "F", "G", "A", "B"] as const) {
    if (base.startsWith(note)) return note;
  }
  return "";
}

function chordTypeFromFormula(chord: ChordDef): ChordType {
  const f = chord.formula;
  if (f.includes("M2")) return ChordType.sus2;
  if (f.includes("P4")) return ChordType.sus4;
  if (f.includes("M3") && f.includes("M7")) return ChordType.maj7;
  if (f.includes("m3") && f.includes("m7")) return ChordType.min7;
  if (f.includes("M3") && f.includes("m7")) return ChordType.dom7;
  if (f.includes("m3")) return ChordType.minor;
  if (f.includes("M3")) return ChordType.major;
  return ChordType.major;
}

function isSlashChord(c: ChordDef): boolean {
  return c.name.includes("/");
}

function tag(c: ChordDef, category: ChordCategory): UnifiedChord {
  return { ...c, category, type: chordTypeFromFormula(c), rootNote: parseRootFromName(c.name) };
}

// ── Unified catalog ──

const TYPE_ORDER: Record<ChordType, number> = {
  [ChordType.major]: 0,
  [ChordType.minor]: 1,
  [ChordType.dom7]: 2,
  [ChordType.min7]: 3,
  [ChordType.maj7]: 4,
  [ChordType.sus2]: 5,
  [ChordType.sus4]: 6,
};

function minFret(c: UnifiedChord): number {
  const frets = c.positions.map((p) => p.fret);
  return frets.length > 0 ? Math.min(...frets) : 0;
}

export const ALL_CHORDS_CATALOG: UnifiedChord[] = [
  ...OPEN_MAJOR.map((c) => tag(c, "open")),
  ...OPEN_MINOR.map((c) => tag(c, "open")),
  ...OPEN_SEVENTHS.filter((c) => !isSlashChord(c)).map((c) => tag(c, "open")),
  ...OPEN_COMPLEX.filter((c) => !isSlashChord(c)).map((c) => tag(c, "open")),
  ...BAR_E_SHAPE_MAJOR.map((c) => tag(c, "closed")),
  ...BAR_E_SHAPE_MINOR.map((c) => tag(c, "closed")),
  ...BAR_A_SHAPE_MAJOR.map((c) => tag(c, "closed")),
  ...BAR_A_SHAPE_MINOR.map((c) => tag(c, "closed")),
  ...BAR_G_SHAPE_MAJOR.map((c) => tag(c, "closed")),
].sort((a, b) => {
  const ra = CHROMATIC.indexOf(a.rootNote as (typeof CHROMATIC)[number]);
  const rb = CHROMATIC.indexOf(b.rootNote as (typeof CHROMATIC)[number]);
  if (ra !== rb) return ra - rb;
  if (a.type !== b.type) return TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
  return minFret(a) - minFret(b);
});

// ── Filter helpers ──

export function getChordTypeLabel(type: ChordType): string {
  switch (type) {
    case ChordType.major:
      return "Major";
    case ChordType.minor:
      return "Minor";
    case ChordType.dom7:
      return "Dom 7th";
    case ChordType.min7:
      return "Min 7th";
    case ChordType.maj7:
      return "Maj 7th";
    case ChordType.sus2:
      return "Sus2";
    case ChordType.sus4:
      return "Sus4";
  }
}

export interface ChordFilters {
  category?: ChordCategory | "all";
  types?: ChordType[];
  rootNote?: string | null;
}

export function filterChords(
  catalog: UnifiedChord[],
  filters: ChordFilters,
): UnifiedChord[] {
  return catalog.filter((chord) => {
    if (filters.category && filters.category !== "all" && chord.category !== filters.category) {
      return false;
    }
    if (filters.types && filters.types.length > 0 && !filters.types.includes(chord.type)) {
      return false;
    }
    if (filters.rootNote && chord.rootNote !== filters.rootNote) {
      return false;
    }
    return true;
  });
}

export interface FilterOptions {
  categories: ChordCategory[];
  types: ChordType[];
  rootNotes: string[];
}

export function getAvailableFilters(catalog: UnifiedChord[]): FilterOptions {
  const categorySet = new Set<ChordCategory>();
  const typeSet = new Set<ChordType>();
  const rootSet = new Set<string>();

  for (const chord of catalog) {
    categorySet.add(chord.category);
    typeSet.add(chord.type);
    rootSet.add(chord.rootNote);
  }

  const rootNotes = CHROMATIC.filter((n) => rootSet.has(n));

  return {
    categories: Array.from(categorySet).sort(),
    types: Array.from(typeSet),
    rootNotes,
  };
}
