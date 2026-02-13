"use client";
import React, { useState } from "react";
import Timestable from "./Timestable";
import Quiz from "./Quiz";

export default function TimestablePlayground() {
  const [completed, setCompleted] = useState<string[]>([]);

  function handleComplete(q: { r: number; c: number }) {
    const key = `${q.r}x${q.c}`;
    setCompleted((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <Timestable completed={completed} />
      </div>
      <div>
        <Quiz onComplete={handleComplete} />
      </div>
    </div>
  );
}
