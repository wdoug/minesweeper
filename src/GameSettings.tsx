import React from 'react';
import {
  DEFAULT_X_DIM,
  DEFAULT_Y_DIM,
  DEFAULT_NUM_BOMBS,
  MAX_X_DIM,
  MAX_Y_DIM
} from './config';

type GameSettingsProps = {
  onGameStart: (xDim: number, yDim: number, numBombs: number) => void;
};
type GameSettingsState = {
  xDim: number;
  yDim: number;
  numBombs: number;
};

function boundInt(input: number | string, min: number, max: number) {
  const int = parseInt(input.toString(), 10) || 0;
  return Math.min(Math.max(min, int), max);
}

class GameSettings extends React.Component<
  GameSettingsProps,
  GameSettingsState
> {
  state = {
    xDim: DEFAULT_X_DIM,
    yDim: DEFAULT_Y_DIM,
    numBombs: DEFAULT_NUM_BOMBS
  };

  _startNewGame = (event: React.FormEvent) => {
    event.preventDefault();
    const { xDim, yDim, numBombs } = this.state;
    this.props.onGameStart(xDim, yDim, numBombs);
  };

  _inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newState = { ...this.state, [name]: value };
    const xDim = boundInt(newState.xDim, 1, MAX_X_DIM);
    const yDim = boundInt(newState.yDim, 1, MAX_Y_DIM);
    const numBombs = boundInt(newState.numBombs, 0, xDim * yDim - 1);
    return this.setState({ xDim, yDim, numBombs });
  };

  render() {
    const { xDim, yDim, numBombs } = this.state;
    return (
      <form onSubmit={this._startNewGame}>
        Board settings:
        <label>
          width
          <input
            name="xDim"
            type="number"
            value={xDim}
            onChange={this._inputHandler}
          />
        </label>
        <label>
          height
          <input
            name="yDim"
            type="number"
            value={yDim}
            onChange={this._inputHandler}
          />
        </label>
        <label>
          number of bombs
          <input
            name="numBombs"
            type="number"
            value={numBombs}
            onChange={this._inputHandler}
          />
        </label>
        <button type="submit">Start new game</button>
      </form>
    );
  }
}

export default GameSettings;
