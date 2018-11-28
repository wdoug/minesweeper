import React, { Component } from 'react';
import Board from './Board';
import { DEFAULT_X_DIM, DEFAULT_Y_DIM, DEFAULT_NUM_BOMBS } from './config';
import { createNewBoardWithBombs, BOMB_KEY } from './utils';
import './App.css';

class App extends Component {
  state = {
    nextGameSettings: {
      xDim: DEFAULT_X_DIM,
      yDim: DEFAULT_Y_DIM,
      numBombs: DEFAULT_NUM_BOMBS
    },
    board: createNewBoardWithBombs(
      DEFAULT_X_DIM,
      DEFAULT_Y_DIM,
      DEFAULT_NUM_BOMBS
    )
  };

  componentDidMount() {
    this._addCheats();
  }

  componentDidUpdate() {
    this._addCheats();
  }

  _addCheats = () => {
    window.cheat = window.cheat || {};
    window.cheat.printBoard = () => {
      // eslint-disable-next-line no-console
      console.log(
        this.state.board
          .map(row => row.map(v => (v === BOMB_KEY ? 'X' : v)).join(' '))
          .join('\n')
      );
    };
  };

  _startNewGame = () => {
    const { xDim, yDim, numBombs } = this.state.nextGameSettings;
    this.setState(state => ({
      board: createNewBoardWithBombs(xDim, yDim, numBombs)
    }));
  };

  render() {
    return (
      <div className="App">
        <div>
          <button onClick={this._startNewGame}>Start new game</button>
        </div>
        <Board board={this.state.board} />
      </div>
    );
  }
}

export default App;
