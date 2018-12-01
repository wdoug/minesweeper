import React from 'react';
import { render, fireEvent, getByLabelText } from 'react-testing-library';
import GameSettings, { GameSettingsProps } from '../GameSettings';
import { MAX_X_DIM, MAX_Y_DIM } from '../config';

function setWidth(container: HTMLElement, value: number | string) {
  const input = getByLabelText(container, 'width') as HTMLInputElement;
  fireEvent.change(input, { target: { value, name: 'xDim' } });
  return input;
}
function setHeight(container: HTMLElement, value: number | string) {
  const input = getByLabelText(container, 'height') as HTMLInputElement;
  fireEvent.change(input, { target: { value, name: 'yDim' } });
  return input;
}
function setNumBombs(container: HTMLElement, value: number | string) {
  const input = getByLabelText(
    container,
    'number of bombs'
  ) as HTMLInputElement;
  fireEvent.change(input, { target: { value, name: 'numBombs' } });
  return input;
}

const standardProps = {
  onGameStart: () => {}
};

function renderGameSettings(propOverrides?: Partial<GameSettingsProps>) {
  const rendered = render(
    <GameSettings {...standardProps} {...propOverrides} />
  );
  return {
    ...rendered,

    setWidth: setWidth.bind(null, rendered.container),
    setHeight: setHeight.bind(null, rendered.container),
    setNumBombs: setNumBombs.bind(null, rendered.container)
  };
}

it.each(
  // prettier-ignore
  [
    // input        expected
    [0, 0, 3,       1, 1, 0],
    [-1, 50, -18,   1, MAX_Y_DIM, 0],
    [50, 1e7, 2e5,  MAX_X_DIM, MAX_Y_DIM, MAX_X_DIM * MAX_Y_DIM - 1],
    [5, 50, 100,     5, MAX_Y_DIM, 5 * MAX_Y_DIM - 1],
  ]
)(
  'when given width: %i, height: %i, and number of bombs %i it pins the setting inputs to a valid range: %i, %i, %i',
  (xDim, yDim, numBombs, expectedX, expectedY, expectedNumBombs) => {
    const { setHeight, setWidth, setNumBombs } = renderGameSettings();

    const widthInput = setWidth(xDim);
    const heightInput = setHeight(yDim);
    const numBombsInput = setNumBombs(numBombs);

    expect(widthInput.value).toBe(expectedX.toString());
    expect(heightInput.value).toBe(expectedY.toString());
    expect(numBombsInput.value).toBe(expectedNumBombs.toString());
  }
);

it('calls `onGameStart` when the button is clicked to start a new game', () => {
  const onGameStart = jest.fn();
  const { setHeight, setWidth, setNumBombs, getByText } = renderGameSettings({
    onGameStart
  });
  setWidth(3);
  setHeight(2);
  setNumBombs(1);
  fireEvent.click(getByText('Start new game'));
  expect(onGameStart).toHaveBeenCalledWith(3, 2, 1);
});

it('calls `onGameStart` when the form is submitted', () => {
  const onGameStart = jest.fn();
  const { container, setHeight, setWidth, setNumBombs } = renderGameSettings({
    onGameStart
  });
  setWidth(3);
  setHeight(2);
  setNumBombs(1);
  const form = container.querySelector('form');
  if (!form) {
    throw new Error('No form found');
  }
  fireEvent.submit(form);
  expect(onGameStart).toHaveBeenCalledWith(3, 2, 1);
});
