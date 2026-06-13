# Unified Chords Page

**Slug:** `20260614-unified-chords-page`

## Summary

Merge the separate `/open-chords` and `/closed-chords` pages into a single `/chords` exploration page. Model after the Notes page — a browseable chord catalog with intuitive filtering. No quizzes or tests; purely exploration.

## Motivation

- Two separate chord tabs (Open / Closed) fragment what is conceptually one topic: chords.
- Learners want to compare chord voicings across positions — e.g. find all ways to play a C chord.
- The Notes page's exploration model (presets, filters, fretboard) is proven and intuitive. Apply the same approach to chords.

## Scope

### In Scope
- Single `/chords` page with full chord catalog
- Filter by position: Open / Closed / All
- Filter by chord type: Major, Minor, dom7, min7, maj7, sus2, sus4
- Filter by root note (12-note chromatic selector)
- Chord cards showing: name, fretboard diagram, formula, type badge
- Match count and empty state handling
- Navbar + homepage updates (single "Chords" entry)
- Redirects from old paths

### Out of Scope
- Quizzes / tests / practice modes
- Inversions or slash chords (D/F#, C/G, E/G# excluded from catalog)
- New chord data beyond existing definitions
- Diminished / augmented / add9 / other extended chords
- Mobile app (web only)

## Current State

- `/open-chords` — GameCard list of 4 groups (Open Major, Open Minor, Open 7ths, Open Complex), each linking to Learn/Quiz sub-pages.
- `/closed-chords` — GameCard list of 4 groups (E-Shape Major/Minor, A-Shape Major/Minor).
- Navbar shows both as separate top-level links. Homepage shows both as separate cards.
- Course uses `/chords/learn/[group]` and `/chords/quiz/[group]` sub-routes — these must be preserved.

---

## Target State (End State)

### Page Layout

A single main Fretboard at the top displays the selected chord's positions. Below it, a grid of clickable chord cards. Clicking a card selects it and updates the main fretboard. This mirrors the Notes page pattern (one fretboard + a grid below).

```
┌─────────────────────────────────────────────────────────────┐
│  Navbar: [Notes] [Chords] [Scales] ...                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Position:  [All] [Open] [Closed]                     │  │
│  │  Type:  [Major] [Minor] [dom7] [min7] [maj7] [sus2]  │  │
│  │         [sus4]                                        │  │
│  │  Root:  [All] [C] [C#] [D] [D#] [E] [F] [F#] ...     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 MAIN FRETBOARD                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  X  ●───●───●───●───●───●───●───●───●───●───●   │  │  │
│  │  │  ●  ───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼─  │  │  │
│  │  │  ●  ───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼─  │  │  │
│  │  │  ●  ───┼───┼───●───┼───┼───┼───┼───┼───┼───┼─  │  │  │
│  │  │  ●  ───┼───┼───┼───●───┼───┼───┼───┼───┼───┼─  │  │  │
│  │  │  ●  ───┼───┼───┼───●───┼───┼───┼───┼───┼───┼─  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │           C Major  ·  R · M3 · P5                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Showing 24 chords                                          │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ ▓ C Major    │ │   C Minor    │ │   C dom7     │        │
│  │   R·M3·P5    │ │   R·m3·P5    │ │   R·M3·P5·m7 │        │
│  │   [MAJOR]    │ │   [MINOR]    │ │   [DOM7]     │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │   C maj7     │ │   ...        │ │   ...        │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

The selected chord card has a highlighted border/ring (▓). The main fretboard shows that chord's finger positions with muted strings marked with X.

### Component Tree

```
page.tsx
├── FilterBar
│   ├── PositionToggle (segmented: All | Open | Closed)
│   ├── TypeChips (multi-select: Major, Minor, dom7, min7, maj7, sus2, sus4)
│   └── RootNoteGrid (12-button chromatic grid + All, single-select)
├── MainFretboard (one large Fretboard, shows selected chord)
│   └── Chord name + formula label below it
├── MatchCount ("Showing N chords" label)
└── ChordGrid (responsive 2-4 col grid)
    └── ChordCard[] (repeated, clickable)
        ├── ChordName (e.g. "C Major")
        ├── FormulaLabel (e.g. "R · M3 · P5")
        └── TypeBadge (color-coded pill)
```

### Selection Behavior

- **Default state**: The first visible chord is auto-selected and displayed in the main fretboard.
- **Click a chord card**: Selects it, highlights the card border, updates the main fretboard to show that chord's positions + muted strings.
- **Click the already-selected card**: Deselects it, main fretboard clears (shows empty fretboard or "Select a chord" prompt).
- **Changing filters**: If the selected chord is no longer in the visible set, auto-select the first visible chord. If no chords visible, clear the fretboard.
- **Selected card styling**: `ring-2 ring-primary` border, slightly elevated/brighter background.

### Filter Behavior

Filter bar at top of page, all filters combine with AND logic. Changing any filter immediately updates the grid (no submit button).

**Position filter** — segmented toggle, single-select:
- `All` — show both open and closed chords (default)
- `Open` — only open-position chords
- `Closed` — only closed-position chords

**Type filter** — multi-select chip buttons:
- `Major`, `Minor`, `dom7`, `min7`, `maj7`, `sus2`, `sus4`
- When none selected: show all types (default)
- When one or more selected: show only chords matching any selected type (OR within type)
- Selected chips appear filled/active; unselected appear outlined

**Root note filter** — 12-button grid, single-select:
- `C`, `C#`/`Db`, `D`, `D#`/`Eb`, `E`, `F`, `F#`/`Gb`, `G`, `G#`/`Ab`, `A`, `A#`/`Bb`, `B`
- `All` (default) or a specific note
- Selecting a note shows only chords whose root matches

**Combined filter example**: Position=Open + Type=[Major, Minor] + Root=C → shows all open C Major and C Minor chords.

**Match count**: "Showing 12 chords" (or "Showing 0 chords — try adjusting filters.") with a "Reset filters" link when count is 0.

### ChordCard Design

Each card in the grid (clickable, NO fretboard inside):
- **Width**: Responsive, min ~200px
- **Border**: 1px rounded card, subtle shadow on hover
- **Selected state**: `ring-2 ring-primary` border, slightly brighter bg, shadow
- **Chord name**: Bold, top of card (e.g. "C Major", "A Minor 7")
- **Formula**: Subdued text below name (e.g. "R · M3 · P5")
- **Type badge**: Color-coded pill, bottom-right of card:
  - Major → blue, Minor → purple, dom7 → amber, min7 → rose, maj7 → emerald, sus2 → cyan, sus4 → teal
- **No fretboard inside the card** — the main Fretboard above handles all chord visualization.

### Empty State

When no chords match: centered text "No chords match — try adjusting filters." with a "Reset filters" button that clears all filters to defaults.

### Error State

If ALL_CHORDS_CATALOG is empty or fails to load: centered text "Could not load chord catalog. Please try again." with a retry button.

---

## Data Model

### TypeScript Types

```ts
// chords.ts

export type ChordCategory = 'open' | 'closed';

export type ChordType = 'major' | 'minor' | 'dom7' | 'min7' | 'maj7' | 'sus2' | 'sus4';

export interface UnifiedChord extends ChordDef {
  category: ChordCategory;
  type: ChordType;
  rootNote: string;  // e.g. "C", "A#", "F#"
}

export const ALL_CHORDS_CATALOG: UnifiedChord[] = [
  // Open — Major
  { name: 'C Major', category: 'open', type: 'major', rootNote: 'C', ... },
  { name: 'A Major', category: 'open', type: 'major', rootNote: 'A', ... },
  { name: 'G Major', category: 'open', type: 'major', rootNote: 'G', ... },
  { name: 'E Major', category: 'open', type: 'major', rootNote: 'E', ... },
  { name: 'D Major', category: 'open', type: 'major', rootNote: 'D', ... },
  // Open — Minor
  { name: 'A Minor', category: 'open', type: 'minor', rootNote: 'A', ... },
  { name: 'E Minor', category: 'open', type: 'minor', rootNote: 'E', ... },
  { name: 'D Minor', category: 'open', type: 'minor', rootNote: 'D', ... },
  // Open — 7ths
  { name: 'C Major 7', category: 'open', type: 'maj7', rootNote: 'C', ... },
  { name: 'A Minor 7', category: 'open', type: 'min7', rootNote: 'A', ... },
  { name: 'G7', category: 'open', type: 'dom7', rootNote: 'G', ... },
  { name: 'E7', category: 'open', type: 'dom7', rootNote: 'E', ... },
  { name: 'D7', category: 'open', type: 'dom7', rootNote: 'D', ... },
  // Open — Suspended
  { name: 'Csus2', category: 'open', type: 'sus2', rootNote: 'C', ... },
  { name: 'Csus4', category: 'open', type: 'sus4', rootNote: 'C', ... },
  { name: 'Asus2', category: 'open', type: 'sus2', rootNote: 'A', ... },
  { name: 'Asus4', category: 'open', type: 'sus4', rootNote: 'A', ... },
  // Closed — E-shape Major
  { name: 'F Major (E-shape)', category: 'closed', type: 'major', rootNote: 'F', ... },
  { name: 'G Major (E-shape)', category: 'closed', type: 'major', rootNote: 'G', ... },
  // Closed — E-shape Minor
  { name: 'F# Minor (E-shape)', category: 'closed', type: 'minor', rootNote: 'F#', ... },
  { name: 'G Minor (E-shape)', category: 'closed', type: 'minor', rootNote: 'G', ... },
  // Closed — A-shape Major
  { name: 'C Major (A-shape)', category: 'closed', type: 'major', rootNote: 'C', ... },
  // Closed — A-shape Minor
  { name: 'C# Minor (A-shape)', category: 'closed', type: 'minor', rootNote: 'C#', ... },
  // Closed — 7ths
  { name: 'F7 (E-shape)', category: 'closed', type: 'dom7', rootNote: 'F', ... },
  // ... etc (all existing chords tagged)
];
```

### Filter Helpers

```ts
// chords-filters.ts (or chords.ts)

export type PositionFilter = 'all' | 'open' | 'closed';

export interface ChordFilters {
  position: PositionFilter;
  types: ChordType[];      // empty = all
  rootNote: string | null; // null = all
}

export function filterChords(catalog: UnifiedChord[], filters: ChordFilters): UnifiedChord[];

export function getChordTypeLabel(type: ChordType): string;
// "major" → "Major", "dom7" → "Dominant 7th", etc.
```

---

## Route Strategy

| From | To | Method |
|------|----|--------|
| `/open-chords` | `/chords?position=open` | `next.config.ts` redirect (308) |
| `/closed-chords` | `/chords?position=closed` | `next.config.ts` redirect (308) |
| `/chords/learn/[group]` | unchanged | preserved |
| `/chords/quiz/[group]` | unchanged | preserved |

---

## Files Touched

### New files
| File | Purpose |
|------|---------|
| `apps/guitar/src/app/chords/page.tsx` | New `/chords` exploration page |
| `apps/guitar/src/components/ChordFilterBar.tsx` | Filter bar component (position, type, root) |
| `apps/guitar/src/components/ChordGrid.tsx` | Responsive chord card grid |
| `apps/guitar/src/components/ChordCard.tsx` | Individual chord display card |

### Modified files
| File | Change |
|------|--------|
| `apps/guitar/src/lib/chords.ts` | Add types, UnifiedChord, ALL_CHORDS_CATALOG, helpers |
| `apps/guitar/src/components/GuitarLayout.tsx` | Navbar: two links → one "Chords" link |
| `apps/guitar/src/app/page.tsx` | Homepage: two cards → one "Chords" card |
| `apps/guitar/next.config.ts` | Add redirects for old routes |

### Preserved (no changes)
| File | Reason |
|------|--------|
| `apps/guitar/src/app/chords/learn/[group]/page.tsx` | Course needs these |
| `apps/guitar/src/app/chords/quiz/[group]/page.tsx` | Course needs these |

---

## Acceptance Criteria

- [ ] `/chords` loads and displays the full chord catalog in a responsive grid
- [ ] Position filter toggles between All, Open, Closed and updates results instantly
- [ ] Type chips are multi-selectable and filter with OR logic within types, AND across filters
- [ ] Root note selector filters to chords of the selected root only
- [ ] Match count updates dynamically with filter changes
- [ ] Empty state shows guidance text and reset link when 0 chords match
- [ ] Chord cards display: name, fretboard diagram, formula, type badge with correct colors
- [ ] Navbar shows single "Chords" link instead of two separate links
- [ ] Homepage shows single "Chords" card instead of two separate cards
- [ ] `/open-chords` → redirects to `/chords`
- [ ] `/closed-chords` → redirects to `/chords`
- [ ] `/chords/learn/[group]` and `/chords/quiz/[group]` continue to work
- [ ] Type check passes: `pnpm --filter guitar check-types` exits 0

---

## Rounds

| # | Round | Tasks |
|---|-------|-------|
| 1 | Data Layer — Chord Catalog & Filter Metadata | 7 |
| 2 | Chords Exploration Page — UI & Filtering | 7 |
| 3 | Navigation Integration & Route Cleanup | 6 |
