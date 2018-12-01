import React, { Component } from 'react';
import Board from './Board';
import { DEFAULT_X_DIM, DEFAULT_Y_DIM, DEFAULT_NUM_BOMBS } from './config';
import GameSettings from './GameSettings';
import './App.css';

type AppState = {
  xDim: number;
  yDim: number;
  numBombs: number;
  gameKey: number;
};

class App extends Component<{}, AppState> {
  state = {
    xDim: DEFAULT_X_DIM,
    yDim: DEFAULT_Y_DIM,
    numBombs: DEFAULT_NUM_BOMBS,
    gameKey: 1
  };

  _startNewGame = (xDim: number, yDim: number, numBombs: number) => {
    this.setState(state => ({
      xDim,
      yDim,
      numBombs,
      gameKey: state.gameKey + 1
    }));
  };

  render() {
    const { xDim, yDim, numBombs, gameKey } = this.state;
    return (
      <div className="App">
        <GameSettings onGameStart={this._startNewGame} />
        <Board xDim={xDim} yDim={yDim} numBombs={numBombs} gameKey={gameKey} />
      </div>
    );
  }
}

export default App;
