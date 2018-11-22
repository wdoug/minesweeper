export function range(n) {
  return [...Array(n).keys()];
}

export const BOMB_KEY = 'BOMB';

export function createEmptyBoard(xDim, yDim) {
  return range(yDim).map(() => range(xDim).map(() => 0));
}

export function copyBoard(board) {
  return board.map(row => row.map(val => val));
}

/**
 * Adds a bomb to a board at the specified location and increments
 * the count of surrounding non-bomb tiles
 * By default it does not mutate the original board but returns a
 * new one with the updates. The mutate argument allows mutating the
 * original board instead
 * @param {Array<Array<number|string>>} board
 * @param {number} x
 * @param {number} y
 * @param {boolean} mutate
 */
export function addBombToBoard(board, x, y, mutate = false) {
  const xDim = board[0].length;
  const yDim = board.length;
  if (x < 0 || x >= xDim) {
    throw new Error(
      `Tried to add a bomb outside the bounds of a board. Expected a value between 0 and ${xDim} but instead got ${x}`
    );
  }
  if (y < 0 || y >= yDim) {
    throw new Error(
      `Tried to add a bomb outside the bounds of a board. Expected a value between 0 and ${yDim} but instead got ${y}`
    );
  }

  if (board[y][x] === BOMB_KEY) {
    // Already has a bomb at that location
    return board;
  }

  if (!mutate) {
    // This could also be updated to keep the rows that aren't changed
    // but for now this is quite a bit simpler
    board = copyBoard(board);
  }

  board[y][x] = BOMB_KEY;

  // Increment the count of surrounding non-bomb cells
  const xIndexes = [-1, 0, 1].map(i => x + i).filter(i => i >= 0 && i < xDim);
  const yIndexes = [-1, 0, 1].map(j => y + j).filter(j => j >= 0 && j < yDim);
  for (let j of yIndexes) {
    for (let i of xIndexes) {
      const currVal = board[j][i];
      if (currVal !== BOMB_KEY) {
        board[j][i] += 1;
      }
    }
  }
  return board;
}

/**
 * Randomly shuffles an array into a new array
 * @param {Array} arr
 */
export function shuffle(arr) {
  // TODO get a better implementation of this
  const arrCopy = arr.map(v => v);
  const shuffledArr = [];
  while (arrCopy.length > 0) {
    const randomRemainingValue = arrCopy.splice(
      Math.floor(Math.random() * arrCopy.length),
      1
    )[0];
    shuffledArr.push(randomRemainingValue);
  }
  return shuffledArr;
}

/**
 * Returns a new board with `numBombs` randomly placed bombs
 * @param {number} xDim
 * @param {number} yDim
 * @param {number} numBombs
 */
export function createNewBoardWithBombs(xDim, yDim, numBombs) {
  if (numBombs > xDim * yDim) {
    throw new Error(
      `Tried to create a board with more bombs than possible. Expected a number of bombs between 0 and ${xDim *
        yDim} but instead got ${numBombs}`
    );
  }

  const boardWithBombs = createEmptyBoard(xDim, yDim);

  // Create bomb order
  // shuffling an array allows for a random order while efficiently
  // maintaining a specified number of bombs
  let bombOrder = new Array(xDim * yDim).fill(BOMB_KEY, 0, numBombs);
  bombOrder = shuffle(bombOrder);

  let valueIdx = 0;
  for (let j of range(yDim)) {
    for (let i of range(xDim)) {
      if (bombOrder[valueIdx] === BOMB_KEY) {
        addBombToBoard(boardWithBombs, i, j, true);
      }
      valueIdx += 1;
    }
  }
  return boardWithBombs;
}
