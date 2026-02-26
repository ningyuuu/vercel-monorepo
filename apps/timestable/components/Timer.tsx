"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

export type TimerState = {
  displaySeconds: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
};

export function useTimer(): TimerState {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startedAtRef = useRef<number | null>(null);

  const start = useCallback(() => {
    startedAtRef.current = Date.now();
    setElapsedMs(0);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    if (startedAtRef.current != null) {
      setElapsedMs(Date.now() - startedAtRef.current);
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    startedAtRef.current = null;
    setElapsedMs(0);
  }, []);

  useEffect(() => {
    if (!isRunning || startedAtRef.current == null) return;

    const id = window.setInterval(() => {
      if (startedAtRef.current == null) return;
      setElapsedMs(Date.now() - startedAtRef.current);
    }, 100);

    return () => window.clearInterval(id);
  }, [isRunning]);

  return {
    displaySeconds: (elapsedMs / 1000).toFixed(1),
    start,
    stop,
    reset,
  };
}

export default function Timer({ timerState }: { timerState: TimerState }) {
  const { displaySeconds } = timerState;

  return (
    <div className="text-sm text-zinc-700 dark:text-zinc-300">
      Time: {displaySeconds}s
    </div>
  );
}
