"use client";

import { useState } from "react";

export const BLANK = 0,
  X = 1,
  O = 2;

type CellState = typeof BLANK | typeof X | typeof O;
type BoardState = [
  CellState,
  CellState,
  CellState,
  CellState,
  CellState,
  CellState,
  CellState,
  CellState,
  CellState,
];

export function useBoardState(): [
  BoardState,
  React.Dispatch<React.SetStateAction<BoardState>>,
] {
  const initState: BoardState = [
    BLANK,
    BLANK,
    BLANK,
    X,
    BLANK,
    O,
    BLANK,
    BLANK,
    BLANK,
  ];
  return useState<BoardState>(initState);
}

function Cell({ state, onClick }: { state: CellState; onClick: () => void }) {
  const printStates = [" ", "X", "O"];
  return (
    <div
      className="font-mono whitespace-pre border border-white px-4 py-4"
      onClick={onClick}
    >
      {printStates[state]}
    </div>
  );
}

export function Board({
  state,
  updateState,
}: {
  state: BoardState;
  updateState: (index: number) => void;
}) {
  return (
    <div className="font-mono whitespace-pre">
      <div className="flex ">
        <Cell state={state[0]} onClick={() => updateState(0)} />
        <Cell state={state[1]} onClick={() => updateState(1)} />
        <Cell state={state[2]} onClick={() => updateState(2)} />
      </div>
      <div className="flex ">
        <Cell state={state[3]} onClick={() => updateState(3)} />
        <Cell state={state[4]} onClick={() => updateState(4)} />
        <Cell state={state[5]} onClick={() => updateState(5)} />
      </div>
      <div className="flex">
        <Cell state={state[6]} onClick={() => updateState(6)} />
        <Cell state={state[7]} onClick={() => updateState(7)} />
        <Cell state={state[8]} onClick={() => updateState(8)} />
      </div>
    </div>
  );
}
