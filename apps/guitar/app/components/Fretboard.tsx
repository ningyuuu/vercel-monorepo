"use client";

import React from "react";

const STRINGS = [
  { label: "e", note: "E", octave: 4 },
  { label: "B", note: "B", octave: 3 },
  { label: "G", note: "G", octave: 3 },
  { label: "D", note: "D", octave: 3 },
  { label: "A", note: "A", octave: 2 },
  { label: "E", note: "E", octave: 2 },
];

const NOTES = [
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

const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19];
const DOUBLE_MARKERS = [12];

function getNoteName(openNote: string, fret: number): string {
  const openIndex = NOTES.indexOf(openNote);
  if (openIndex === -1) return "";
  return NOTES[(openIndex + fret) % 12] ?? "";
}

export function Fretboard() {
  const frets = Array.from({ length: 20 }, (_, i) => i); // 0 (open/nut) to 19

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <div className="min-w-[880px] p-4 sm:p-6">
        {/* Header with fret numbers */}
        <div
          className="grid items-end pb-2"
          style={{ gridTemplateColumns: `48px repeat(19, 1fr)` }}
        >
          <div />
          {frets.slice(1).map((fret) => (
            <div
              key={fret}
              className="text-muted-foreground text-[11px] font-medium text-center"
            >
              {fret}
              {FRET_MARKERS.includes(fret) && (
                <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-primary/60 align-middle" />
              )}
            </div>
          ))}
        </div>

        {/* Fretboard grid */}
        <div
          className="grid gap-0 rounded-lg border border-border overflow-hidden"
          style={{
            gridTemplateColumns: `48px repeat(19, 1fr)`,
            background: "linear-gradient(to right, #3d2b1f, #4e3826, #3d2b1f)",
          }}
        >
          {STRINGS.map((string, stringIndex) =>
            frets.map((fret) => {
              const isNut = fret === 0;
              const isDoubleMarker = DOUBLE_MARKERS.includes(fret);
              const isMarker = FRET_MARKERS.includes(fret);
              const note = isNut ? string.note : getNoteName(string.note, fret);
              const stringThickness = Math.max(1, 3.2 - stringIndex * 0.35);

              if (isNut) {
                // String name cell
                return (
                  <div
                    key={`${stringIndex}-${fret}`}
                    className="flex items-center justify-center h-10 bg-amber-950/60 border-r-2 border-r-amber-950"
                  >
                    <span className="text-xs font-bold text-amber-200">
                      {string.label}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={`${stringIndex}-${fret}`}
                  className={`
                    relative flex items-start justify-center pt-1.5
                    border-r border-r-amber-900/40
                    ${stringIndex !== STRINGS.length - 1 ? "border-b border-b-amber-900/30" : ""}
                    h-10
                    group
                  `}
                >
                  {/* Fret marker dots */}
                  {isMarker && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {isDoubleMarker ? (
                        <div className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-100/30" />
                          <div className="h-2 w-2 rounded-full bg-amber-100/30" />
                        </div>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-amber-100/30" />
                      )}
                    </div>
                  )}

                  {/* String line */}
                  <div
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{
                      height: stringThickness,
                      background:
                        "linear-gradient(to bottom, #bfa080 0%, #e8d8c0 40%, #e8d8c0 60%, #bfa080 100%)",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1,
                    }}
                  />

                  {/* Note label (above the string line) */}
                  <span className="relative z-10 text-[10px] font-medium text-amber-100/60 transition-colors group-hover:text-amber-100">
                    {note}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer labels */}
        <div
          className="grid mt-1"
          style={{ gridTemplateColumns: `48px repeat(19, 1fr)` }}
        >
          <div />
          {frets.slice(1).map((fret) => (
            <div
              key={fret}
              className="text-muted-foreground text-[10px] text-center"
            >
              {fret}f
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
