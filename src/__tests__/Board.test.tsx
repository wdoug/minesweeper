import React from 'react';
import { render, fireEvent, getByTestId } from 'react-testing-library';
import * as utils from '../utils';
import Board, { BoardProps } from '../Board';

const { BOMB_KEY } = utils;

jest.useFakeTimers();

// prettier-ignore
const mockBoard = [[0, 1, BOMB_KEY, 2       ],
                   [0, 2, 3,        BOMB_KEY],
                   [0, 1, BOMB_KEY, 2       ]];

function countRevealedCards(container: HTMLElement) {
  const buttons = container.querySelectorAll('button');
  return Array.from(buttons).reduce(
    (count, btn) => (btn.disabled ? count + 1 : count),
    0
  );
}

function getCard(container: HTMLElement, x: number, y: number) {
  return getByTestId(container, `card-${x}-${y}`);
}

function clickCard(container: HTMLElement, x: number, y: number) {
  const cardBtn = getByTestId(container, `card-${x}-${y}`).querySelector(
    'button'
  );

  if (cardBtn) {
    fireEvent.click(cardBtn);
  } else {
    throw new Error(`No card button to click at x: ${x}, y: ${y}`);
  }
}

const standardProps = {
  xDim: 4,
  yDim: 3,
  numBombs: 3,
  gameKey: 1
};

function renderBoard(propOverrides?: Partial<BoardProps>) {
  const rendered = render(<Board {...standardProps} {...propOverrides} />);
  return {
    ...rendered,

    // Add custom functions for interacting with the rendered board
    countRevealedCards: countRevealedCards.bind(null, rendered.container),
    getCard: getCard.bind(null, rendered.container),
    clickCard: clickCard.bind(null, rendered.container)
  };
}

describe('Board funcionality', () => {
  beforeEach(() => {
    jest
      .spyOn(utils, 'createNewBoardWithBombs')
      .mockImplementation(() => mockBoard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders initially hidden cards for each of the board cells', () => {
    const { container, countRevealedCards } = renderBoard();
    expect(container).toBeInTheDocument();

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(12);
    expect(countRevealedCards()).toBe(0);
    expect(utils.createNewBoardWithBombs).toHaveBeenLastCalledWith(4, 3, 3);
  });
  it('reveals the cards when clicked', () => {
    const { getCard, clickCard, countRevealedCards } = renderBoard();

    clickCard(1, 0);
    expect(getCard(1, 0).textContent).toBe('1');
    expect(countRevealedCards()).toBe(1);

    clickCard(2, 1);
    expect(getCard(2, 1).textContent).toBe('3');
    expect(countRevealedCards()).toBe(2);
  });

  it('reveals the surrounding cards when revealing a card with no adjacent bombs', () => {
    const { countRevealedCards, clickCard } = renderBoard();
    clickCard(0, 0);
    jest.runAllTimers();
    expect(countRevealedCards()).toBe(6);
  });

  describe('when a bomb is revealed', () => {
    let container: HTMLElement,
      getByText: (textmatch: string | RegExp) => HTMLElement;

    beforeEach(() => {
      let clickCard;
      ({ container, clickCard, getByText } = renderBoard());
      clickCard(2, 0);
    });

    it('disables the ability to interact with the cards', () => {
      const buttons = container.querySelectorAll('button');
      expect(Array.from(buttons).every(b => b.disabled)).toBe(true);
    });

    it('shows the status as failed', () => {
      expect(getByText(/status/i).textContent).toBe('Status: FAILED');
    });
  });

  describe('when all non-bomb cards are revealed', () => {
    let container: HTMLElement,
      getByText: (textmatch: string | RegExp) => HTMLElement;

    beforeEach(() => {
      ({ container, getByText } = renderBoard());
      mockBoard.forEach((row, j) =>
        row.forEach((v, i) => {
          if (v !== BOMB_KEY) {
            clickCard(container, i, j);
          }
        })
      );
    });

    it('disables the ability to interact with the cards', () => {
      const buttons = container.querySelectorAll('button');
      expect(Array.from(buttons).every(b => b.disabled)).toBe(true);
    });

    it('shows the status as succeeded', () => {
      expect(getByText(/status/i).textContent).toBe('Status: SUCCEEDED');
    });
  });

  describe('when unmounted while revealing cards', () => {
    // window.setTimeout is stubbed by calling jest.useFakeTimers() above
    let originalSetTimeout = (window.setTimeout as any).getMockImplementation();

    beforeEach(() => {
      // Currently jest doesn't appear to expose a method to test that timeouts
      // have been cleared. See https://github.com/facebook/jest/issues/3949
      // This mocking allows us to test that the timeout is cleared before the
      // callback is executed
      ((setTimeout as unknown) as jest.Mock<number>).mockImplementation(
        (cb, delay) =>
          originalSetTimeout(() => {
            throw new Error('timeout was not cleared');
          }, delay)
      );
    });

    afterEach(() => {
      ((setTimeout as unknown) as jest.Mock<number>).mockImplementation(
        originalSetTimeout
      );
    });

    it('cleans up timeouts', () => {
      const { clickCard, unmount } = renderBoard();
      clickCard(0, 0);
      unmount();
      jest.runAllTimers();
    });
  });
});
