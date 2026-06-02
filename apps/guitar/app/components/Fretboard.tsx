"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const STRINGS = [
  { label: "e", note: "E", octave: 4 },
  { label: "B", note: "B", octave: 3 },
  { label: "G", note: "G", octave: 3 },
  { label: "D", note: "D", octave: 3 },
  { label: "A", note: "A", octave: 2 },
  { label: "E", note: "E", octave: 2 },
];

export const NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const FRET_MARKERS = [
  { fret: 3, dots: 1 },
  { fret: 5, dots: 1 },
  { fret: 7, dots: 1 },
  { fret: 9, dots: 1 },
  { fret: 12, dots: 2 },
  { fret: 15, dots: 1 },
  { fret: 17, dots: 1 },
  { fret: 19, dots: 1 },
];

export function getNoteName(openNote: string, fret: number): string {
  const openIndex = NOTES.indexOf(openNote);
  if (openIndex === -1) return "";
  return NOTES[(openIndex + fret) % 12] ?? "";
}

export function Fretboard({
  highlights,
  showNotes = true,
  muted = [],
}: {
  highlights?: { stringIndex: number; fret: number }[] | null;
  showNotes?: boolean;
  muted?: number[];
}) {
  const [showStringNames, setShowStringNames] = useState(false);
  const frets = Array.from({ length: 20 }, (_, i) => i);

  const isHighlighted = (stringIndex: number, fret: number) =>
    highlights?.some(
      (h) => h.stringIndex === stringIndex && h.fret === fret,
    ) ?? false;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <div className="min-w-[880px] p-4 sm:p-6">
        <div className="grid items-end pb-2" style={{ gridTemplateColumns: `48px repeat(19, 1fr)` }}>
          <div className="flex items-center justify-center pb-0.5">
            <button
              type="button"
              onClick={() => setShowStringNames((v) => !v)}
              className="flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title={showStringNames ? "Show numbers" : "Show note names"}
            >
              {showStringNames ? (
                <EyeOff className="size-3" />
              ) : (
                <Eye className="size-3" />
              )}
            </button>
          </div>
          {frets.slice(1).map((fret) => (
            <div
              key={fret}
              className={`text-muted-foreground text-[11px] font-medium text-center ${showStringNames ? "" : "opacity-0"}`}
            >
              {fret}
            </div>
          ))}
        </div>

        <div
          className="grid gap-0 rounded-lg border border-border overflow-hidden"
          style={{
            gridTemplateColumns: `48px repeat(19, 1fr)`,
            background: "var(--fretboard-wood)",
          }}
        >
          {STRINGS.map((string, stringIndex) =>
            frets.map((fret) => {
              const isNut = fret === 0;
              const note = isNut ? string.note : getNoteName(string.note, fret);
              const stringThickness = Math.max(1, 3.2 - stringIndex * 0.35);
              const highlighted = isHighlighted(stringIndex, fret);

              if (isNut) {
                const isMuted = muted.includes(stringIndex);
                return (
                    <div
                    key={`${stringIndex}-${fret}`}
                    className={`flex items-center justify-center h-10 bg-stone-300 dark:bg-amber-950/60 border-r-2 border-r-stone-400 dark:border-r-amber-950 ${
                      highlighted ? "ring-2 ring-inset ring-yellow-400" : ""
                    }`}
                  >
                    <span className={`text-xs font-bold ${isMuted ? "text-red-500" : "text-stone-700 dark:text-amber-200"}`}>
                      {isMuted ? "X" : showStringNames ? string.label : stringIndex + 1}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={`${stringIndex}-${fret}`}
                  className={`
                    relative flex items-start justify-center pt-1.5
                    border-r border-r-stone-400/40 dark:border-r-amber-900/40
                    ${stringIndex !== STRINGS.length - 1 ? "border-b border-b-stone-400/30 dark:border-b-amber-900/30" : ""}
                    h-10
                    group
                    ${highlighted ? "bg-yellow-400/20" : ""}
                  `}
                >
                  <div
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{
                      height: stringThickness,
                      background: "var(--fretboard-string)",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1,
                    }}
                  />

                  <span
                    className={`relative z-10 text-[10px] font-medium transition-colors ${
                      highlighted
                        ? "text-yellow-600 dark:text-yellow-300 font-bold"
                        : "text-stone-600/60 dark:text-amber-100/60 group-hover:text-stone-800 dark:group-hover:text-amber-100"
                    }`}
                  >
                    {showNotes ? note : ""}
                  </span>
                </div>
              );
            }),
          )}
        </div>

        <div className="grid items-start pt-2" style={{ gridTemplateColumns: `48px repeat(19, 1fr)` }}>
          <div />
          {frets.slice(1).map((fret) => (
            <div
              key={fret}
              className="text-muted-foreground text-[11px] font-medium text-center"
            >
              {(() => {
                const marker = FRET_MARKERS.find((m) => m.fret === fret);
                if (!marker) return null;
                return (
                  <div className="flex items-center justify-center gap-0.5">
                    {Array.from({ length: marker.dots }).map((_, i) => (
                      <span
                        key={i}
                        className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60"
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
