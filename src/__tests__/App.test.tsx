import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent } from 'react-testing-library';
import App from '../App';
import * as utils from '../utils';

const { createEmptyBoard, addBombToBoard } = utils;

// prettier-ignore
const emptyBoard = createEmptyBoard(8, 8);
const mockBoard = addBombToBoard(emptyBoard, 1, 1);
const mockBoard2 = addBombToBoard(mockBoard, 1, 0);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('has an button to start a new game', () => {
  const { getByText } = render(<App />);
  expect(getByText('Start new game')).toBeInTheDocument();
});

it('renders a board', () => {
  const { container } = render(<App />);
  expect(container.querySelector('.Board')).toBeInTheDocument();
});

describe('App functionality', () => {
  beforeEach(() => {
    jest
      .spyOn(utils, 'createNewBoardWithBombs')
      .mockImplementationOnce(() => mockBoard)
      .mockImplementationOnce(() => mockBoard2);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('initially creates an 8x8 board with 10 bombs', () => {
    const { container } = render(<App />);
    expect(utils.createNewBoardWithBombs).toHaveBeenCalledWith(8, 8, 10);
    const buttons = container.querySelectorAll('.Board button');
    expect(buttons.length).toBe(8 * 8);
  });

  it('creates a new board with cards hidden when "Start new game" is clicked', () => {
    const { getByTestId, getByText } = render(<App />);
    const cardBtn = getByTestId('card-0-0').querySelector('button');
    if (!cardBtn) {
      throw new Error('No card button to click at 0, 0');
    }
    fireEvent.click(cardBtn);
    expect(cardBtn.disabled).toBe(true);
    expect(getByTestId('card-0-0').textContent).toBe('1');

    fireEvent.click(getByText('Start new game'));
    expect(cardBtn.disabled).toBe(false);
    expect(getByTestId('card-0-0').textContent).toBe('');
  });
});
