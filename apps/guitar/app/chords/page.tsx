"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@repo/ui/button";
import {
  ALL_CHORDS_CATALOG,
  getChordTypeLabel,
  filterChords,
  ChordType,
  type ChordCategory,
  type UnifiedChord,
} from "../components/chords";
import { Fretboard } from "../components/Fretboard";

const CHROMATIC = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;

const TYPE_COLORS: Record<ChordType, string> = {
  [ChordType.major]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [ChordType.minor]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [ChordType.dom7]:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  [ChordType.min7]:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  [ChordType.maj7]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [ChordType.sus2]:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  [ChordType.sus4]:
    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
};

function ChordCard({ chord, selected, onClick }: { chord: UnifiedChord; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border bg-card p-4 space-y-2 hover:shadow-md transition-all text-left w-full ${
        selected
          ? "ring-2 ring-primary border-primary shadow-md"
          : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-tight">
          {chord.name}
        </h3>
        <span
          className={`shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded-full ${TYPE_COLORS[chord.type]}`}
        >
          {getChordTypeLabel(chord.type)}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">{chord.formula}</p>
    </button>
  );
}

export default function ChordsPage() {
  const [category, setCategory] = useState<ChordCategory | "all">("all");
  const [selectedTypes, setSelectedTypes] = useState<ChordType[]>([]);
  const [rootNote, setRootNote] = useState<string | null>(null);
  const [selectedChord, setSelectedChord] = useState<UnifiedChord | null>(
    null,
  );

  function toggleType(type: ChordType) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  const visibleChords = useMemo(
    () =>
      filterChords(ALL_CHORDS_CATALOG, {
        category,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        rootNote,
      }),
    [category, selectedTypes, rootNote],
  );

  useEffect(() => {
    if (visibleChords.length > 0) {
      const stillVisible = selectedChord
        ? visibleChords.find((c) => c.slug === selectedChord.slug)
        : undefined;
      setSelectedChord(stillVisible ?? visibleChords[0]!);
    } else {
      setSelectedChord(null);
    }
  }, [visibleChords]);

  function handleChordClick(chord: UnifiedChord) {
    setSelectedChord((prev) => (prev?.slug === chord.slug ? null : chord));
  }

  const availableRootNotes = useMemo(() => {
    const set = new Set<string>();
    ALL_CHORDS_CATALOG.forEach((c) => set.add(c.rootNote));
    return CHROMATIC.filter((n) => set.has(n));
  }, []);

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-6xl px-4 pb-12 pt-20 space-y-6 sm:px-6 sm:pt-24">
        {/* Position toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Position:
          </span>
          <div className="inline-flex rounded-lg border border-border bg-muted p-0.5">
            {(["all", "open", "closed"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  category === cat
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "all" ? "All" : cat === "open" ? "Open" : "Closed"}
              </button>
            ))}
          </div>
        </div>

        {/* Type chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-1">
            Type:
          </span>
          {Object.values(ChordType).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                selectedTypes.includes(type)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
              }`}
            >
              {getChordTypeLabel(type)}
            </button>
          ))}
        </div>

        {/* Root note selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-medium text-muted-foreground mr-1">
            Root:
          </span>
          <button
            type="button"
            onClick={() => setRootNote(null)}
            className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
              rootNote === null
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {availableRootNotes.map((note) => (
            <button
              key={note}
              type="button"
              onClick={() => setRootNote(note)}
              className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                rootNote === note
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {note}
            </button>
          ))}
        </div>

        {/* Main Fretboard */}
        {selectedChord ? (
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="-mx-4 overflow-x-auto">
              <Fretboard
                highlights={selectedChord.positions}
                showNotes
                muted={selectedChord.muted}
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{selectedChord.name}</span>
              <span className="text-muted-foreground">
                · {selectedChord.formula}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-16 text-muted-foreground text-sm">
            Select a chord to view it on the fretboard.
          </div>
        )}

        {/* Match count */}
        <p className="text-sm text-muted-foreground">
          {visibleChords.length} chord{visibleChords.length !== 1 ? "s" : ""}
        </p>

        {/* Chord grid or empty state */}
        {visibleChords.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className="text-muted-foreground text-base">
              No chords match — try adjusting filters.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategory("all");
                setSelectedTypes([]);
                setRootNote(null);
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleChords.map((chord) => (
              <ChordCard
                key={chord.slug}
                chord={chord}
                selected={selectedChord?.slug === chord.slug}
                onClick={() => handleChordClick(chord)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
