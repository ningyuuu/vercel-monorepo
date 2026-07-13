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

export function useBoardState(): BoardState {
  return [BLANK, BLANK, BLANK, BLANK, BLANK, BLANK, BLANK, BLANK, BLANK];
}

export function Board({ state }: { state: BoardState }) {
  const printStates = [" ", "X", "O"];
  return (
    <div>
      <p>
        {printStates[state[0]]} | {printStates[state[1]]} |{" "}
        {printStates[state[2]]}
      </p>
      <p>
        {printStates[state[3]]} | {printStates[state[4]]} |{" "}
        {printStates[state[5]]}
      </p>
      <p>
        {printStates[state[6]]} | {printStates[state[7]]} |{" "}
        {printStates[state[8]]}
      </p>
    </div>
  );
}
