import React from 'react';
import { copyBoard, forEachSurroundingCell, BOMB_KEY } from './utils';
import Card from './Card';
import { NEXT_REVEAL_TIMEOUT } from './config';
import './Board.css';

const gameStates = {
  PLAYING: 'PLAYING',
  FAILED: 'FAILED',
  SUCCEEDED: 'SUCCEEDED'
};

function getInitialState(board) {
  return {
    revealedCards: board.map(row => row.map(value => false)),
    gameState: gameStates.PLAYING
  };
}

class Board extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.timeoutIds = [];
    this.state = getInitialState(props.board);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.board !== this.props.board) {
      this.setState(getInitialState(this.props.board));
    }
  }

  _getRevealCardCallback = (x, y) => () => {
    this._revealCards([[x, y]]);
    if (this.props.board[y][x] === BOMB_KEY) {
      this.setState({
        gameState: gameStates.FAILED
      });
    }
  };

  _getNextCardsToReveal = (x, y) => {
    const { revealedCards } = this.state;
    const nextCardsToReveal = [];

    forEachSurroundingCell(this.props.board, x, y, (val, i, j) => {
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

          if (this.props.board[y][x] === 0) {
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
          }, NEXT_REVEAL_TIMEOUT)
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
    const { gameState } = this.state;
    const gameFinished =
      gameState === gameStates.FAILED || gameState === gameStates.SUCCEEDED;
    return (
      <div className="Board">
        <div>Status: {gameState}</div>
        {this.props.board.map((row, j) => {
          return (
            <div key={j} className="Board-row">
              {row.map((value, i) => (
                <Card
                  key={i}
                  value={value}
                  revealed={this.state.revealedCards[j][i]}
                  onReveal={this._getRevealCardCallback(i, j)}
                  testid={`card-${i}-${j}`}
                  locked={gameFinished}
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
