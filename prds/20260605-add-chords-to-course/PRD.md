# PRD: Add Chords to 60-Day Course (Ralph Loop)

## Goal

Integrate chord learning into the existing 60-day linear course (currently fretboard note identification only). Students learn chords alongside notes in a single progression. Still 60 days.

## Current State

- `lib/curriculum.ts` defines 60 `Lesson` objects, all `contentType` implicitly "note"
- `app/components/chords.ts` has 42 chords across 8 groups (28 open, 14 barre) with `ChordDef` interface
- `app/components/ChordLearn.tsx` and `ChordQuiz.tsx` exist and work standalone at `/chords/learn/[group]` and `/chords/quiz/[group]`
- `app/components/levels.ts` already has a `"chord"` GameMode and a `makeChordLevel()` helper — the hook is ready
- `app/course/[day]/page.tsx` renders learn/quiz for notes only; needs a branch for chord content type

## Design Decisions

1. **Add `contentType` to Lesson** — `"note"` | `"chord"`. Backward-compatible (default `"note"`).
2. **Add `chordGroup` to Lesson** — references a key mapping to an array of `ChordDef[]`. The course day page reads this and renders `ChordLearn`/`ChordQuiz` accordingly.
3. **Swap ~15 existing days for chord content** — replace quiz-only days that repeat note quizzing at the same fret range.
4. **Add ~8 review days** — spaced repetition to reinforce memory. Review days quiz across wider fret ranges or multiple chord groups. They replace some of the more redundant quiz days.
5. **Add quizzes to learn days** — no more auto-pass. Every learn day ends with a 10-question quiz (80% to pass). Active recall is baked into every day.
6. **No new components** — reuse `ChordLearn` and `ChordQuiz` as-is. Chord quiz is 4-option multiple choice (already built).

## Lesson Interface Changes

```typescript
// lib/curriculum.ts
export type ContentType = "note" | "chord" | "mixed";
export type LessonMode = "learn" | "quiz" | "review";
export type ChordGroupKey =
  | "open-major"
  | "open-minor"
  | "open-sevenths"
  | "barre-e-major"
  | "barre-e-minor"
  | "barre-a-major"
  | "barre-a-minor";

export interface Lesson {
  // ... existing fields ...
  contentType: ContentType;               // default "note"
  mode: LessonMode;                       // "learn" | "quiz" | "review"
  chordGroup?: ChordGroupKey | ChordGroupKey[]; // chord groups for chord/mixed days
  reviewScopes?: {                        // only for mode === "review"
    type: "note" | "chord";
    frets?: number[];
    stringFocus?: StringFocus;
    noteFilter?: NoteFilter;
    chordGroups?: ChordGroupKey[];
  }[];
  questionCount: number;                  // > 0 always now — learn days get 10
  learnCount?: number;                    // how many to show in the learn sweep before quiz (default 0 = full set)
  passThreshold: number;                  // 0.8 for all days (no more auto-pass)
}
```

### Learn mode now includes a quiz

Previously `mode: "learn"` had `questionCount: 0` and `passThreshold: 0` (auto-pass). Now:
- Learner first sees a **sweep** of all positions/chords (`learnCount` items shown one-by-one, 0 = all).
- Then takes a **10-question quiz** on that same content.
- Must score **80%** to pass and unlock the next day.

This ensures active recall on every single day — no passive viewing.

## Chord Groups (from existing chords.ts)

| Key | Chords | Count |
|-----|--------|-------|
| `open-major` | C, A, G, E, D | 5 |
| `open-minor` | Am, Em, Dm | 3 |
| `open-sevenths` | C7, G7, D7, A7, E7, Am7, Em7, Dm7 | 8 |
| `barre-e-major` | F, F#, G, A (E-shape) | 4 |
| `barre-e-minor` | Fm, F#m, Gm, G#m (Em-shape) | 4 |
| `barre-a-major` | B, C, C#, E (A-shape) | 4 |
| `barre-a-minor` | Bm, Cm (Am-shape) | 2 |

Total: **30 chords** (12 less-common chords skipped — sus, maj7, D/F# etc. — can be added later as bonus content).

## Day Distribution — 60 Days

| Category | Count | Description |
|----------|-------|-------------|
| Note learn days | ~18 | Learn sweep + 10-question quiz on a new fret range |
| Note quiz days | ~12 | 30-question quiz on cumulative fret range |
| Chord learn days | ~8 | Learn sweep + 10-question quiz on a chord group |
| Chord quiz days | ~7 | 30-question chord identification quiz |
| Review days | ~10 | Mixed review quizzing prior content (notes + chords) |
| **Total** | **~55** (+5 buffer for hybrid days) | |

### Review Days (spaced repetition)

Review days revisit content from 2–3 prior sections. Spaced at roughly 5–7 day intervals with increasing gaps:

| Review # | Around Day | Revisits | Content |
|----------|-----------|----------|---------|
| R1 | 7 | Days 1–6 | Open strings + frets 0–2 notes |
| R2 | 14 | Days 1–13 | First position notes + open major chords |
| R3 | 21 | Days 8–20 | Open chords & middle neck notes |
| R4 | 28 | Days 15–27 | Middle neck notes + 7th chords |
| R5 | 35 | Days 22–34 | Barre E-shape + upper-middle notes |
| R6 | 42 | Days 29–41 | Barre chords + upper neck notes |
| R7 | 49 | Days 36–48 | All barre chords + upper neck notes |
| R8 | 56 | Days 43–55 | Full board notes + chord recognition |
| R9 | 60 | Days 1–59 | Grand review — everything |

Review days use `mode: "review"` with `reviewScopes` listing the content to pull from. Questions are drawn randomly from across all referenced scopes.

### Learn Days Now Include a Quiz

Every learn day (`mode: "learn"`) follows this two-phase structure:

1. **Sweep phase** — all notes/chords are shown on the fretboard one by one. Student clicks "next" to advance. This is the exact same UI as current learn mode.
2. **Quiz phase** — immediately after the sweep, a 10-question quiz on the same content. Must score 80% (8/10) to pass.

This replaces the old `questionCount: 0, passThreshold: 0` pattern. There are no more auto-pass days.

### Chord Days — ~15 Days

Chord learn days teach chord shapes using `ChordLearn` (sweep → quiz). Chord quiz days quiz chord identification using `ChordQuiz` (4-option multiple choice).

**Section 1: First Position (days 1–14, frets 0–4)** — 5 chord days
- Open Major I: learn C, A, G
- Open Major I Quiz
- Open Major II: learn E, D
- Open Major II Quiz
- Open Minor: learn Am, Em, Dm (learn + quiz)

Plus 1 review day (R1).

**Section 2: Middle Neck (days 15–26, frets 5–8)** — 4 chord days
- Open 7ths I: learn C7, G7, D7, A7
- Open 7ths I Quiz
- Open 7ths II: learn E7, Am7, Em7, Dm7
- Open 7ths II Quiz

Plus 2 review days (R2, R3).

**Section 3: Upper Middle (days 27–38, frets 9–12)** — 3 chord days
- Barre E-Shape Major: learn F, F#, G, A
- Barre E-Shape Major Quiz
- Barre E-Shape Minor: learn Fm, F#m, Gm, G#m

Plus 1 review day (R4).

**Section 4: Upper Neck (days 39–50, frets 13–19)** — 2 chord days
- Barre A-Shape Major: learn B, C, C#, E
- Barre A-Shape Major Quiz
- Barre A-Shape Minor is folded into review

Plus 2 review days (R5, R6).

**Section 5: Synthesis (days 51–60, full board)** — 1 chord day
- Chord Recognition (quiz, all groups)

Plus 2 review days (R7, R8) and the grand review on day 60 (R9).

## Ralph Loop Plan (7 Rounds)

Ship each round before starting the next. Don't build everything at once.

| Round | Scope | Deliverable |
|-------|-------|-------------|
| **R1 — Type & Learn Quiz** | Extend `Lesson` interface with `contentType`, `chordGroup`, `reviewScopes`. Add `"review"` mode. Add quiz-after-learn phase to learn days. Hardcode 1 test chord day to verify end-to-end. | Learn days have quizzes. Chord day renders in the course. |
| **R2 — Section 1** | Add 5 chord days + 1 review day to Section 1. Consolidate some early note days to keep section at 14 days. | Section 1 has chord + review content. |
| **R3 — Section 2** | Add 4 chord days + 2 review days to Section 2. | Open chords + spaced reviews integrated. |
| **R4 — Section 3** | Add 3 barre chord days + 1 review day to Section 3. | Barre E-shape chords in course. |
| **R5 — Section 4** | Add 2 barre chord days + 2 review days to Section 4. | Barre A-shape chords in course. |
| **R6 — Section 5** | Add 1 chord day + 2 review days + grand review (day 60). Mixed note+chord `contentType: "mixed"`. | Full 60-day course with chords and spaced repetition. |
| **R7 — Polish** | Add chord icons to course overview day pills. Ensure review days show "Review" badge. Any UX refinements from dogfooding. | Polished course experience. |

## Implementation Notes

### Learn mode: sweep → quiz

```
if (lesson.mode === "learn") {
  // Phase 1: sweep — show all positions/chords one by one (existing behavior)
  // Phase 2: quiz — 10 random questions from the same content set
  //    - note: generate 10 note identification questions from lesson.frets / lesson.stringFocus / lesson.noteFilter
  //    - chord: generate 10 chord identification questions from CHORD_GROUP_MAP[lesson.chordGroup]
  // Must score >= 80% to pass.
  // Show two-phase progress bar: "Learn ████████░░ Quiz ░░░░░░░░░░"
}
```

### Review days

```
if (lesson.mode === "review" && lesson.reviewScopes) {
  // Generate questions from each scope in reviewScopes:
  //   { type: "note", frets: [0,4], stringFocus: "all", noteFilter: "natural" }
  //   { type: "chord", chordGroups: ["open-major"] }
  // 30 questions, randomly sampled across all scopes (weighted by scope size).
  // All note questions use existing note quiz UI. All chord questions use ChordQuiz.
  // For mixed review days (contentType: "mixed"), interleave note and chord questions.
}
```

### Review scope sampling

When a review day covers multiple frets ranges, questions are drawn proportionally. E.g. a review covering 8 fret-positions and 5 chords → ~18 note questions + ~12 chord questions out of 30.

### `course/[day]/page.tsx` branching

```
if (lesson.contentType === "chord" || 
    (lesson.mode === "review" && hasChordScopes)) {
  const chords = resolveChords(lesson)
  if (lesson.mode === "learn")   return <ChordLearn chords={chords} quizAfter={true} />
  if (lesson.mode === "quiz" || lesson.mode === "review")  
    return <ChordQuiz chords={chords} questionCount={lesson.questionCount} />
}
if (lesson.contentType === "mixed") {
  // interleave note questions and chord questions
  return <MixedQuiz lesson={lesson} />
}
// else: existing note logic (now with quiz-after-learn)
```

### Progress tracking

No changes to `lib/progress.ts` — localStorage format stays the same (`lastCompletedDay: number`). Review days and chord days gate just like every other day.

### Course overview page (`/course`)

- Day pills show icon: musical note for note days, chord diagram for chord days, refresh/repeat icon for review days.
- Review days get a "Review" badge on the pill.
- Section progress bars unchanged.

### Chord group map

Export a `Record<ChordGroupKey, ChordDef[]>` from `chords.ts` mapping keys to the existing chord arrays. Already mostly there — the groups are already separate exported arrays.

## Acceptance Criteria

- [ ] `Lesson` interface extended with `contentType`, `chordGroup`, `reviewScopes`, `learnCount`
- [ ] `mode: "review"` added to LessonMode
- [ ] Learn days have a 10-question quiz after the sweep, 80% to pass (no more auto-pass)
- [ ] Course day page renders chord learn/quiz/review when `contentType === "chord"`
- [ ] Review days pull questions from multiple prior scopes
- [ ] 60 days remain: ~15 chord days, ~10 review days, ~35 note days
- [ ] Review days are spaced roughly every 5–7 days across the course
- [ ] Progress gating works for all day types
- [ ] Existing standalone chord pages (`/open-chords`, `/closed-chords`, etc.) still work (unchanged)
