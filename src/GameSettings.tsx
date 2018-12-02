import React from 'react';
import {
  DEFAULT_X_DIM,
  DEFAULT_Y_DIM,
  DEFAULT_NUM_BOMBS,
  MAX_X_DIM,
  MAX_Y_DIM
} from './config';
import './GameSettings.css';

export type GameSettingsProps = {
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
      <form className="GameSettings" onSubmit={this._startNewGame}>
        Board settings:
        <label className="GameSettings-label">
          width:
          <input
            className="GameSettings-input"
            name="xDim"
            type="number"
            value={xDim}
            onChange={this._inputHandler}
          />
        </label>
        <label className="GameSettings-label">
          height:
          <input
            className="GameSettings-input"
            name="yDim"
            type="number"
            value={yDim}
            onChange={this._inputHandler}
          />
        </label>
        <label className="GameSettings-label">
          number of bombs:
          <input
            className="GameSettings-input"
            name="numBombs"
            type="number"
            value={numBombs}
            onChange={this._inputHandler}
          />
        </label>
        <button className="GameSettings-submit" type="submit">
          Start new game
        </button>
      </form>
    );
  }
}

export default GameSettings;
