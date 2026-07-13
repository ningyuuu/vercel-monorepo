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

export type GameState = {
  state: BoardState;
  winState: WinState;
  current: CellState;
  play: (index: number) => void;
};

export function useBoardState(): GameState {
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
  const [current, setCurrent] = useState<CellState>(X);

  const play = (index: number) => {
    if (!!winState || state[index] !== BLANK) {
      return;
    }

    const newState = [...state] as BoardState;
    newState[index] = current;
    setState(newState);
    setCurrent(current === X ? O : X);

    setWinState(checkWin(newState));
  };

  return {
    state,
    play,
    winState,
    current,
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
  play,
}: {
  state: BoardState;
  play: (index: number) => void;
}) {
  return (
    <div className="font-mono whitespace-pre">
      <div className="flex ">
        <Cell state={state[0]} onClick={() => play(0)} />
        <Cell state={state[1]} onClick={() => play(1)} />
        <Cell state={state[2]} onClick={() => play(2)} />
      </div>
      <div className="flex ">
        <Cell state={state[3]} onClick={() => play(3)} />
        <Cell state={state[4]} onClick={() => play(4)} />
        <Cell state={state[5]} onClick={() => play(5)} />
      </div>
      <div className="flex">
        <Cell state={state[6]} onClick={() => play(6)} />
        <Cell state={state[7]} onClick={() => play(7)} />
        <Cell state={state[8]} onClick={() => play(8)} />
      </div>
    </div>
  );
}
