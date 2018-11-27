import React from 'react';
import {
  createNewBoardWithBombs,
  copyBoard,
  forEachSurroundingCell,
  BOMB_KEY
} from './utils';
import Card from './Card';
import './Board.css';

const config = {
  DEFAULT_X_DIM: 8,
  DEFAULT_Y_DIM: 8,
  DEFAULT_NUM_BOMBS: 10,
  NEXT_REVEAL_TIMEOUT: 100
};

function getNewGameState(xDim, yDim, numBombs) {
  const board = createNewBoardWithBombs(xDim, yDim, numBombs);
  const revealedCards = board.map(row => row.map(value => false));
  return { board, revealedCards };
}

class Board extends React.Component {
  state = {
    ...getNewGameState(
      config.DEFAULT_X_DIM,
      config.DEFAULT_Y_DIM,
      config.DEFAULT_NUM_BOMBS
    )
  };
  timeoutIds = [];

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

  _getRevealCardCallback = (x, y) => () => {
    this._revealCards([[x, y]]);
  };

  _getNextCardsToReveal = (x, y) => {
    const { board, revealedCards } = this.state;
    const nextCardsToReveal = [];

    forEachSurroundingCell(board, x, y, (val, i, j) => {
      if (!revealedCards[j][i]) {
        nextCardsToReveal.push([i, j]);
      }
    });

    return nextCardsToReveal;
  };

  _revealCards = xyLocations => {
    let nextCardsToReveal = [];

    this.setState(state => {
      const updatedRevealedCards = copyBoard(state.revealedCards);
      xyLocations.forEach(([x, y]) => {
        if (!updatedRevealedCards[y][x]) {
          updatedRevealedCards[y][x] = true;

          if (state.board[y][x] === 0) {
            nextCardsToReveal = nextCardsToReveal.concat(
              this._getNextCardsToReveal(x, y)
            );
          }
        }
      });

      if (nextCardsToReveal.length > 0) {
        this.timeoutIds.push(
          setTimeout(() => {
            this._revealCards(nextCardsToReveal);
          }, config.NEXT_REVEAL_TIMEOUT)
        );
      }

      return {
        revealedCards: updatedRevealedCards
      };
    });
  };

  componentWillUnmount() {
    this.timeoutIds.forEach(id => clearTimeout(id));
  }

  render() {
    return (
      <div className="Board">
        {this.state.board.map((row, j) => {
          return (
            <div key={j} className="Board-row">
              {row.map((value, i) => (
                <Card
                  key={i}
                  value={value}
                  revealed={this.state.revealedCards[j][i]}
                  onReveal={this._getRevealCardCallback(i, j)}
                  testid={`card-${i}-${j}`}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Board;
