"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Fretboard } from "./Fretboard";
import type { ChordDef } from "./chords";

export function ChordLearn({ chords, title }: { chords: ChordDef[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const chord = chords[idx];
  if (!chord || chords.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-base">
          {idx + 1} of {chords.length}
        </p>
      </div>

      <div className="rounded-xl border bg-card/60 p-4 space-y-3">
        <h3 className="text-lg font-semibold tracking-tight">
          {chord.name}
        </h3>
        <div className="-mx-2">
            <Fretboard
                highlights={chord.positions}
                showNotes={true}
                muted={chord.muted}
              />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIdx(idx - 1)}
          disabled={idx === 0}
        >
          <ChevronLeft className="size-4" />
          Prev
        </Button>
        <span className="text-sm text-muted-foreground tabular-nums min-w-[3rem] text-center">
          {idx + 1} / {chords.length}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIdx(idx + 1)}
          disabled={idx === chords.length - 1}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
