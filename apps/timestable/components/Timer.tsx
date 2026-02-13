"use client";
import React, { useEffect, useState } from "react";

export default function Timer({
  startSignal,
  stopSignal,
}: {
  startSignal: number;
  stopSignal: number;
}) {
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // start when startSignal increments
  useEffect(() => {
    if (startSignal === 0) return;
    setStartTime(Date.now());
    setElapsed(0);
    setRunning(true);
  }, [startSignal]);

  // stop when stopSignal increments
  useEffect(() => {
    if (stopSignal === 0) return;
    if (startTime != null) {
      setElapsed(Date.now() - startTime);
    }
    setRunning(false);
  }, [stopSignal]);

  // update every 100ms while running
  useEffect(() => {
    if (!running || startTime == null) return;
    const id = window.setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    return () => window.clearInterval(id);
  }, [running, startTime]);

  const display = (elapsed / 1000).toFixed(1);

  return (
    <div className="text-sm text-zinc-700 dark:text-zinc-300">
      Time: {display}s
    </div>
  );
}
