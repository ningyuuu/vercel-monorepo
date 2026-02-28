"use client";

import { Button } from "@repo/ui/button";

export default function BoardControls({
  disabled,
  onReset,
  onRevealAnswer,
  revealMessage,
}: {
  disabled: boolean;
  onReset: () => void;
  onRevealAnswer: () => void;
  revealMessage: string;
}) {
  return (
    <>
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          type="button"
          onClick={onReset}
          disabled={disabled}
          title="shortcut: Backspace"
        >
          Reset
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onRevealAnswer}
          disabled={disabled}
        >
          Reveal answer
        </Button>
      </div>
      {revealMessage ? (
        <p className="mt-1 text-center text-foreground">{revealMessage}</p>
      ) : null}
    </>
  );
}
