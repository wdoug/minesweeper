import React, { Component } from 'react';
import Board from './Board';
import { DEFAULT_X_DIM, DEFAULT_Y_DIM, DEFAULT_NUM_BOMBS } from './config';
import './App.css';

type State = {
  nextGameSettings: {
    xDim: number;
    yDim: number;
    numBombs: number;
  };
  xDim: number;
  yDim: number;
  numBombs: number;
  gameKey: number;
};

function boundInt(input: number | string, min: number, max: number) {
  const int = parseInt(input.toString(), 10) || 0;
  return Math.min(Math.max(min, int), max);
}

class App extends Component<{}, State> {
  state = {
    nextGameSettings: {
      xDim: DEFAULT_X_DIM,
      yDim: DEFAULT_Y_DIM,
      numBombs: DEFAULT_NUM_BOMBS
    },
    xDim: DEFAULT_X_DIM,
    yDim: DEFAULT_Y_DIM,
    numBombs: DEFAULT_NUM_BOMBS,
    gameKey: 1
  };

  _startNewGame = (event: React.FormEvent) => {
    event.preventDefault();
    this.setState(state => {
      const { xDim, yDim, numBombs } = state.nextGameSettings;
      return {
        xDim,
        yDim,
        numBombs,
        gameKey: state.gameKey + 1
      };
    });
  };

  _inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState(state => {
      let { xDim, yDim, numBombs } = state.nextGameSettings;
      if (name === 'xDim') {
        xDim = boundInt(value, 1, 20);
      } else if (name === 'yDim') {
        yDim = boundInt(value, 1, 20);
      } else {
        numBombs = Number(value);
      }
      numBombs = boundInt(numBombs, 0, xDim * yDim - 1);
      return {
        nextGameSettings: {
          xDim,
          yDim,
          numBombs
        }
      };
    });
  };

  render() {
    const { nextGameSettings, xDim, yDim, numBombs, gameKey } = this.state;
    return (
      <div className="App">
        <form onSubmit={this._startNewGame}>
          Board settings:
          <label>
            width
            <input
              name="xDim"
              type="number"
              value={nextGameSettings.xDim}
              onChange={this._inputHandler}
            />
          </label>
          <label>
            height
            <input
              name="yDim"
              type="number"
              value={nextGameSettings.yDim}
              onChange={this._inputHandler}
            />
          </label>
          <label>
            number of bombs
            <input
              name="numBombs"
              type="number"
              value={nextGameSettings.numBombs}
              onChange={this._inputHandler}
            />
          </label>
          <button type="submit">Start new game</button>
        </form>
        <Board xDim={xDim} yDim={yDim} numBombs={numBombs} gameKey={gameKey} />
      </div>
    );
  }
}

export default App;
