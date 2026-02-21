"use client";
import React, { useEffect, useState } from "react";

export default function Timer({
  startSignal,
  stopSignal,
  resetSignal,
}: {
  startSignal: number;
  stopSignal: number;
  resetSignal?: number;
}) {
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // start when startSignal increments
  /* eslint-disable react-hooks/set-state-in-effect */
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
  }, [stopSignal, startTime]);

  // reset when resetSignal increments
  useEffect(() => {
    if (!resetSignal) return;
    setRunning(false);
    setStartTime(null);
    setElapsed(0);
  }, [resetSignal]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
