import {
  range,
  createEmptyBoard,
  addBombToBoard,
  BOMB_KEY,
  copyBoard,
  shuffle,
  createNewBoardWithBombs
} from '../utils';

describe('utils', () => {
  describe('range', () => {
    it('creates a range of given length', () => {
      expect(range(5)).toEqual([0, 1, 2, 3, 4]);
    });
  });

  describe('createEmptyBoard', () => {
    it('returns a nested array with the specified dimensions', () => {
      const actual = createEmptyBoard(2, 3);
      // prettier-ignore
      const expected = [[0, 0],
                        [0, 0],
                        [0, 0]];
      expect(actual).toEqual(expected);
    });
  });

  describe('copyBoard', () => {
    it('makes a new board with the same data', () => {
      const original = createEmptyBoard(2, 3);
      const copy = copyBoard(original);
      expect(original).toEqual(copy);
      expect(original).not.toBe(copy);
      original.forEach((row, idx) => expect(row).not.toBe(copy[idx]));
    });
  });

  describe('addBombToBoard', () => {
    it('works correctly with a 1x1 board', () => {
      const boardWithBomb = addBombToBoard([[0]], 0, 0);
      expect(boardWithBomb).toEqual([[BOMB_KEY]]);
    });

    it('works for a 2x3 board', () => {
      const board = createEmptyBoard(2, 3);
      // prettier-ignore
      const expectedBoardWithBomb = [[0, 0],
                                     [1, 1],
                                     [1, BOMB_KEY]];

      const boardWithBomb = addBombToBoard(board, 1, 2);
      expect(boardWithBomb).toEqual(expectedBoardWithBomb);
    });

    it('works with multiple bombs', () => {
      const board = createEmptyBoard(3, 3);

      let boardWithBomb = addBombToBoard(board, 1, 2);
      boardWithBomb = addBombToBoard(boardWithBomb, 2, 1);
      // prettier-ignore
      const expectedBoardWithBomb = [[0, 1, 1],
                                     [1, 2, BOMB_KEY],
                                     [1, BOMB_KEY, 2]];

      expect(boardWithBomb).toEqual(expectedBoardWithBomb);
    });

    it('does not mutate by default', () => {
      const originalBoard = createEmptyBoard(1, 1);
      addBombToBoard(originalBoard, 0, 0);
      expect(originalBoard).toEqual([[0]]);
    });

    it('can mutate if specified', () => {
      const originalBoard = createEmptyBoard(1, 1);
      addBombToBoard(originalBoard, 0, 0, true);
      expect(originalBoard).toEqual([[BOMB_KEY]]);
    });

    it('throws an error if trying to add a bomb out of bounds', () => {
      const board = createEmptyBoard(2, 3);
      expect(() => addBombToBoard(board, 2, 0)).toThrow(
        'Tried to add a bomb outside the bounds of a board. Expected a value between 0 and 2 but instead got 2'
      );
      expect(() => addBombToBoard(board, -1, 0)).toThrow(
        'Tried to add a bomb outside the bounds of a board. Expected a value between 0 and 2 but instead got -1'
      );
      expect(() => addBombToBoard(board, 0, 3)).toThrow(
        'Tried to add a bomb outside the bounds of a board. Expected a value between 0 and 3 but instead got 3'
      );
      expect(() => addBombToBoard(board, 0, -1)).toThrow(
        'Tried to add a bomb outside the bounds of a board. Expected a value between 0 and 3 but instead got -1'
      );
    });

    it('does not update a board if there is already a bomb where requesting one being added', () => {
      const originalBoard = createEmptyBoard(2, 2);
      let boardWithBomb = addBombToBoard(originalBoard, 1, 1);
      boardWithBomb = addBombToBoard(boardWithBomb, 1, 1);
      // prettier-ignore
      const expectedBoardWithBomb = [[1, 1],
                                     [1, BOMB_KEY]];
      expect(boardWithBomb).toEqual(expectedBoardWithBomb);
    });
  });

  describe('shuffle', () => {
    let mathRandomOrig = Math.random;

    beforeEach(() => {
      Math.random = jest.fn(() => 0.3);
    });

    afterEach(() => {
      Math.random = mathRandomOrig;
    });

    it('does not mutate the array', () => {
      const originalArr = [1, 2, 3];
      const shuffledArr = shuffle(originalArr);
      expect(originalArr).toEqual([1, 2, 3]);
      expect(shuffledArr).not.toBe(originalArr);
    });

    it('has the same values as the original array', () => {
      const originalArr = range(7);
      const shuffledArr = shuffle(originalArr);
      expect(originalArr.length).toEqual(shuffledArr.length);
      expect(originalArr.sort()).toEqual(shuffledArr.sort());
    });
  });

  describe('createNewBoard', () => {
    beforeEach(() => {
      // Math.random = jest().returns(0);
    });

    it('throws an error if the number of bombs to add is greater than the number of cells in the board', () => {
      expect(() => createNewBoardWithBombs(2, 2, 5)).toThrow(
        'Tried to create a board with more bombs than possible. Expected a number of bombs between 0 and 4 but instead got 5'
      );
    });

    it('works with 0 bombs', () => {
      expect(createNewBoardWithBombs(2, 1, 0)).toEqual([[0, 0]]);
    });

    it('works with as many bombs as there are cells', () => {
      // This is definitely a weird use case, but it should still be valid
      expect(createNewBoardWithBombs(2, 1, 2)).toEqual([[BOMB_KEY, BOMB_KEY]]);
    });
  });
});
