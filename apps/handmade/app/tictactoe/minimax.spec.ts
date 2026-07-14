import { describe, it, expect } from "vitest";
import { minimax } from "./minimax";
import {
  BLANK,
  X,
  O,
  checkWin,
  nextPlayer,
  type CellState,
  type GameState,
} from "./Board";

type StateArray = number[] & { length: 9 };

function makeState(state: StateArray, current: CellState): GameState {
  return {
    state: state as GameState["state"],
    current,
    winState: checkWin(state as GameState["state"]),
    play: () => {},
  };
}

function emptyState(): StateArray {
  return Array(9).fill(BLANK) as StateArray;
}

function playFullGame(
  aiPlayer: CellState,
  opponentMoves: number[],
): { result: CellState | 0 | null; finalState: number[] } {
  const state = Array(9).fill(BLANK) as number[];
  let current: CellState = X;
  let oppIdx = 0;

  while (checkWin(state as GameState["state"]) === null) {
    if (current === aiPlayer) {
      const move = minimax(makeState(state as StateArray, current), aiPlayer);
      state[move] = current;
    } else {
      if (oppIdx >= opponentMoves.length) break;
      const move = opponentMoves[oppIdx++]!;
      if (state[move] !== BLANK) break;
      state[move] = current;
    }
    current = nextPlayer(current);
  }

  return { result: checkWin(state as GameState["state"]), finalState: state };
}

describe("minimax", () => {
  describe("game already over", () => {
    it("returns -1 when X has already won", () => {
      const state = makeState([X, X, X, O, O, BLANK, BLANK, BLANK, BLANK], O);
      expect(minimax(state, O)).toBe(-1);
    });

    it("returns -1 when O has already won", () => {
      const state = makeState([O, O, O, X, X, BLANK, BLANK, BLANK, BLANK], X);
      expect(minimax(state, X)).toBe(-1);
    });

    it("returns -1 on a draw (full board)", () => {
      const state = makeState([X, O, X, X, O, O, O, X, X], X);
      expect(minimax(state, X)).toBe(-1);
    });
  });

  describe("winning move", () => {
    it("completes a column (X at 0,3)", () => {
      const state = makeState(
        [X, O, BLANK, X, O, BLANK, BLANK, BLANK, BLANK],
        X,
      );
      expect(minimax(state, X)).toBe(6);
    });

    it("completes a diagonal for X (X at 0,4)", () => {
      const state = makeState(
        [X, O, BLANK, O, X, BLANK, BLANK, BLANK, BLANK],
        X,
      );
      expect([2, 8]).toContain(minimax(state, X));
    });

    it("completes anti-diagonal for X (X at 2,4)", () => {
      const state = makeState(
        [O, BLANK, X, BLANK, X, BLANK, BLANK, BLANK, O],
        X,
      );
      expect([1, 6]).toContain(minimax(state, X));
    });

    it("completes a row for O (O at 3,4)", () => {
      const state = makeState(
        [X, BLANK, X, O, O, BLANK, BLANK, BLANK, BLANK],
        O,
      );
      expect([1, 5]).toContain(minimax(state, O));
    });

    it("completes a row for X (X at 0,1)", () => {
      const state = makeState(
        [X, X, BLANK, O, BLANK, O, BLANK, BLANK, BLANK],
        X,
      );
      expect(minimax(state, X)).toBe(2);
    });
  });

  describe("blocking move", () => {
    it("blocks opponent row (X must block O at 0,1)", () => {
      const state = makeState(
        [O, O, BLANK, BLANK, X, BLANK, BLANK, BLANK, BLANK],
        X,
      );
      expect(minimax(state, X)).toBe(2);
    });

    it("blocks opponent column (O at 1,4, X must block)", () => {
      const state = makeState(
        [BLANK, O, BLANK, BLANK, O, BLANK, BLANK, BLANK, X],
        X,
      );
      expect(minimax(state, X)).toBe(7);
    });

    it("blocks opponent diagonal (O at 0,4, X must block at 8)", () => {
      const state = makeState(
        [O, X, BLANK, BLANK, O, X, BLANK, BLANK, BLANK],
        X,
      );
      expect(minimax(state, X)).toBe(8);
    });

    it("blocks opponent anti-diagonal (O at 2,4, X must block)", () => {
      const state = makeState(
        [BLANK, BLANK, O, BLANK, O, BLANK, BLANK, BLANK, X],
        X,
      );
      expect(minimax(state, X)).toBe(6);
    });

    it("prefers winning over blocking", () => {
      const state = makeState(
        [X, X, BLANK, O, O, BLANK, BLANK, BLANK, BLANK],
        X,
      );
      expect(minimax(state, X)).toBe(2);
    });
  });

  describe("optimal opening", () => {
    it("picks center or corner on empty board (X first)", () => {
      const state = makeState(emptyState(), X);
      const move = minimax(state, X);
      expect([0, 2, 4, 6, 8]).toContain(move);
    });

    it("picks a corner when center is taken (O responding)", () => {
      const state = makeState(
        [BLANK, BLANK, BLANK, BLANK, X, BLANK, BLANK, BLANK, BLANK],
        O,
      );
      expect([0, 2, 6, 8]).toContain(minimax(state, O));
    });

    it("picks center when corner is taken (O responding)", () => {
      const state = makeState(
        [X, BLANK, BLANK, BLANK, BLANK, BLANK, BLANK, BLANK, BLANK],
        O,
      );
      expect(minimax(state, O)).toBe(4);
    });
  });

  describe("returns valid index", () => {
    it("always returns an empty cell index", () => {
      const state = makeState(
        [X, O, X, BLANK, O, X, O, BLANK, BLANK],
        O,
      );
      const move = minimax(state, O);
      expect(state.state[move]).toBe(BLANK);
    });
  });

  describe("unbeatable - AI vs AI always draws", () => {
    it("X vs O (both minimax) is always a draw", () => {
      const state = Array(9).fill(BLANK) as number[];
      let current: CellState = X;

      while (checkWin(state as GameState["state"]) === null) {
        const move = minimax(makeState(state as StateArray, current), current);
        state[move] = current;
        current = nextPlayer(current);
      }

      expect(checkWin(state as GameState["state"])).toBe(0);
    });

    it("X vs O (both minimax, X opens center) always draws", () => {
      const state = Array(9).fill(BLANK) as number[];
      state[4] = X;
      let current: CellState = O;

      while (checkWin(state as GameState["state"]) === null) {
        const move = minimax(makeState(state as StateArray, current), current);
        state[move] = current;
        current = nextPlayer(current);
      }

      expect(checkWin(state as GameState["state"])).toBe(0);
    });
  });

  describe("unbeatable - AI never loses", () => {
    it("AI as X never loses against all possible O first replies", () => {
      for (let oppFirst = 0; oppFirst < 9; oppFirst++) {
        if (oppFirst === 0) continue;
        const { result } = playFullGame(X, [oppFirst]);
        expect(result).not.toBe(O);
      }
    });

    it("AI as O never loses against all possible first X moves", () => {
      for (let aiFirst = 0; aiFirst < 9; aiFirst++) {
        const { result } = playFullGame(O, [aiFirst]);
        expect(result).not.toBe(X);
      }
    });

    it("AI as X wins or draws against edge-opening opponent", () => {
      const sequences = [
        [1, 3], [1, 7], [3, 5], [5, 7],
      ];
      for (const seq of sequences) {
        const { result } = playFullGame(X, seq);
        expect(result).not.toBe(O);
      }
    });

    it("AI as O never loses against suboptimal sequences", () => {
      const sequences = [
        [0, 4, 8], [2, 4, 6],
      ];
      for (const seq of sequences) {
        const { result } = playFullGame(O, seq);
        expect(result).not.toBe(X);
      }
    });
  });

  describe("finds winning move in any board", () => {
    it("takes the win when available and not the only option", () => {
      const state = makeState(
        [X, O, BLANK, BLANK, X, BLANK, X, BLANK, O],
        X,
      );
      expect([1, 2, 8]).toContain(minimax(state, X));
    });
  });
});
