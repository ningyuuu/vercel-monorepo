import {
  checkWin,
  nextPlayer,
  type CellState,
  type GameState,
  type WinState,
} from "./Board";

type MinimaxState = {
  state: GameState["state"];
  current: GameState["current"];
};

export function minimax(gameState: GameState, player: CellState): number {
  // if game is over, no play necessary
  if (gameState.winState !== null) {
    return -1;
  }

  // condense state for efficiency
  const minimaxState = getLightWeightState(gameState);

  const { index } = getMinimaxScore(minimaxState, player);
  return index;
}

function getLightWeightState(gameState: GameState): MinimaxState {
  return {
    state: [...gameState.state],
    current: gameState.current,
  };
}

function cloneState(minimaxState: MinimaxState): MinimaxState {
  return {
    state: [...minimaxState.state],
    current: minimaxState.current,
  };
}

function getMinimaxScore(
  gameState: MinimaxState,
  player: CellState,
): { index: number; score: number } {
  // we run a loop to find the move that generates the best score
  // if no winning move exists, we aim for a drawing move
  // if no drawing move exists, we make a move at random
  const moveByPlayer = gameState.current === player;
  let bestScore = moveByPlayer ? -1 : 1;
  let bestIndex = -1;

  for (let i = 0; i < gameState.state.length; i++) {
    // if cell already has play, we skip
    if (gameState.state[i] !== 0) continue;

    // else we make a play, then check win. if win exists we return score.
    // we note whose move it is, relative to the player
    const newGameState = cloneState(gameState);
    newGameState.state[i] = newGameState.current;

    const winState = checkWin(newGameState.state);
    let score;

    if (winState !== null) {
      // game has ended. compute result.
      score = getStateScore(winState, player);
      // if move is by player, we want the max score
    } else {
      // otherwise we run recurise loop till a score is generated.
      newGameState.current = nextPlayer(newGameState.current);
      score = getMinimaxScore(newGameState, player).score;
    }

    if (moveByPlayer && score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
    // if move is by opponent, we want the min score
    if (!moveByPlayer && score < bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return {
    index: bestIndex,
    score: bestScore,
  };
}

function getStateScore(winState: WinState, player: CellState): number {
  if (winState === player) {
    return 1;
  }
  if (winState !== null && winState !== 0 && winState !== player) {
    return -1;
  }
  return 0;
}
