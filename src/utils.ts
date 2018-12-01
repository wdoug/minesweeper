export type Board = Array<Array<number | string>>;

/**
 * Creates a new array with incrementing values from 0 to n - 1
 * @param {number} n
 */
export function range(n: number) {
  return [...Array(n).keys()];
}

export const BOMB_KEY = 'BOMB';

/**
 * Creates a new board of xDim by yDim dimensions initialized to all 0s
 * @param {number} xDim
 * @param {number} yDim
 */
export function createEmptyBoard(xDim: number, yDim: number) {
  return range(yDim).map(() => range(xDim).map(() => 0));
}

/**
 * Makes a new copy of a board
 * @param {Array<Array<number|string>>} board
 */
export function copyBoard<T>(board: T[][]) {
  return board.map(row => row.map(val => val));
}

/**
 * Iterates through the (up to 3x3) grid of surrounding cells including itself.
 * Calls the provided function with the value of the cell and the location
 * @param {Array<Array<number|string>>} board
 * @param {number} x
 * @param {number} y
 * @param {Function} fn
 */
export function forEachSurroundingCell(
  board: Board,
  x: number,
  y: number,
  fn: (val: number | string, i: number, j: number) => void
) {
  const xDim = board[0].length;
  const yDim = board.length;

  const xIndexes = [-1, 0, 1].map(i => x + i).filter(i => i >= 0 && i < xDim);
  const yIndexes = [-1, 0, 1].map(j => y + j).filter(j => j >= 0 && j < yDim);
  for (let j of yIndexes) {
    for (let i of xIndexes) {
      fn(board[j][i], i, j);
    }
  }
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
export function addBombToBoard(
  board: Board,
  x: number,
  y: number,
  mutate = false
) {
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
  forEachSurroundingCell(board, x, y, (val, i, j) => {
    if (val !== BOMB_KEY) {
      (board[j][i] as number) += 1;
    }
  });

  return board;
}

/**
 * Returns a randomly shuffled version of an array (immutable by default)
 * @param {Array} arr
 * @param {boolean} mutate
 */
export function shuffle(arr: any[], mutate = false) {
  if (!mutate) {
    arr = arr.map(v => v);
  }

  // Fisher–Yates shuffle
  let currentIndex = arr.length;

  while (currentIndex > 0) {
    // Pick random remaining element
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // swap with current index element
    const tmp = arr[randomIndex];
    arr[randomIndex] = arr[currentIndex];
    arr[currentIndex] = tmp;
  }

  return arr;
}

/**
 * Returns a new board with `numBombs` randomly placed bombs
 * @param {number} xDim
 * @param {number} yDim
 * @param {number} numBombs
 */
export function createNewBoardWithBombs(
  xDim: number,
  yDim: number,
  numBombs: number
): Board {
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
