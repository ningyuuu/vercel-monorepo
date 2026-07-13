import { useState } from "react";

export const BLANK = 0,
  X = 1,
  O = 2;
export const printState = [" ", "X", "O"];

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
type WinState = CellState | null;

export function useBoardState(): {
  state: BoardState;
  setState: React.Dispatch<React.SetStateAction<BoardState>>;
  winState: WinState;
  setWinState: React.Dispatch<React.SetStateAction<WinState>>;
} {
  const initState: BoardState = [
    BLANK,
    BLANK,
    BLANK,
    BLANK,
    BLANK,
    BLANK,
    BLANK,
    BLANK,
    BLANK,
  ];
  const [state, setState] = useState<BoardState>(initState);
  const [winState, setWinState] = useState<WinState>(null);
  return {
    state,
    setState,
    winState,
    setWinState,
  };
}

export function checkWin(board: BoardState): WinState {
  for (const sym of [1, 2]) {
    // check rows
    for (const i of [0, 3, 6]) {
      if (board[i] === sym && board[i + 1] === sym && board[i + 2] === sym) {
        return sym as WinState;
      }
    }
    // check cols
    for (const i of [0, 1, 2]) {
      if (board[i] === sym && board[i + 3] === sym && board[i + 6] === sym) {
        return sym as WinState;
      }
    }
    // check diagonals
    if (board[0] === sym && board[4] === sym && board[8] === sym) {
      return sym as WinState;
    }
    if (board[2] === sym && board[4] === sym && board[6] === sym) {
      return sym as WinState;
    }
  }
  return null;
}

function Cell({ state, onClick }: { state: CellState; onClick: () => void }) {
  return (
    <div
      className="font-mono whitespace-pre border border-white px-4 py-4"
      onClick={onClick}
    >
      {printState[state]}
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
