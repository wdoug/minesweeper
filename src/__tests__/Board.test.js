import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { BOMB_KEY } from '../utils';
import Board from '../Board';

jest.useFakeTimers();

// prettier-ignore
const board = [[0, 1, BOMB_KEY, 2       ],
               [0, 2, 3,        BOMB_KEY],
               [0, 1, BOMB_KEY, 2       ]];

function renderBoard(ui = <Board board={board} />) {
  const rendered = render(ui);
  return {
    ...rendered,

    // Add custom functions for interacting with the rendered board
    countRevealedCards() {
      const buttons = rendered.container.querySelectorAll('button');
      return [...buttons].reduce(
        (count, btn) => (btn.disabled ? count + 1 : count),
        0
      );
    },

    getCard(x, y) {
      return rendered.getByTestId(`card-${x}-${y}`);
    },

    clickCard(x, y) {
      return fireEvent.click(
        rendered.getByTestId(`card-${x}-${y}`).querySelector('button')
      );
    }
  };
}

it('renders initially hidden cards for each of the board cells', () => {
  const { container, countRevealedCards } = renderBoard();
  expect(container).toBeInTheDocument();

  const buttons = container.querySelectorAll('button');
  expect(buttons.length).toBe(12);
  expect(countRevealedCards()).toBe(0);
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
  let container, getByText;

  beforeEach(() => {
    let clickCard;
    ({ container, clickCard, getByText } = renderBoard());
    clickCard(2, 0);
  });

  it('disables the ability to interact with the cards', () => {
    const buttons = container.querySelectorAll('button');
    expect([...buttons].every(b => b.disabled)).toBe(true);
  });

  it('shows the status as failed', () => {
    expect(getByText(/status/i).textContent).toBe('Status: FAILED');
  });
});

describe('when all non-bomb cards are revealed', () => {
  let container, getByText;

  beforeEach(() => {
    let clickCard;
    ({ container, clickCard, getByText } = renderBoard());
    board.forEach((row, j) =>
      row.forEach((v, i) => {
        if (v !== BOMB_KEY) {
          clickCard(i, j);
        }
      })
    );
  });

  it('disables the ability to interact with the cards', () => {
    const buttons = container.querySelectorAll('button');
    expect([...buttons].every(b => b.disabled)).toBe(true);
  });

  it('shows the status as succeeded', () => {
    expect(getByText(/status/i).textContent).toBe('Status: SUCCEEDED');
  });
});

describe('when unmounted while revealing cards', () => {
  let originalSetTimeout = setTimeout.getMockImplementation();

  beforeEach(() => {
    // Currently jest doesn't appear to expose a method to test that timeouts
    // have been cleared. See https://github.com/facebook/jest/issues/3949
    // This mocking allows us to test that the timeout is cleared before the
    // callback is executed
    setTimeout.mockImplementation((cb, delay) =>
      originalSetTimeout(() => {
        throw new Error('timeout was not cleared');
      }, delay)
    );
  });

  afterEach(() => {
    setTimeout.mockImplementation(originalSetTimeout);
  });

  it('cleans up timeouts', () => {
    const { clickCard, unmount } = renderBoard();
    clickCard(0, 0);
    unmount();
    jest.runAllTimers();
  });
});
