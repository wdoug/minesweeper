import React from 'react';
import {
  copyBoard,
  createNewBoardWithBombs,
  forEachSurroundingCell,
  BOMB_KEY,
  Board as BoardType
} from './utils';
import Card from './Card';
import { NEXT_REVEAL_TIMEOUT } from './config';
import './Board.css';

declare global {
  interface Window {
    cheat: any;
  }
}

type RevealedCards = Array<Array<boolean>>;
type GameStates = 'PLAYING' | 'FAILED' | 'SUCCEEDED';

const gameStates: { [key: string]: GameStates } = {
  PLAYING: 'PLAYING',
  FAILED: 'FAILED',
  SUCCEEDED: 'SUCCEEDED'
};

export type BoardProps = {
  xDim: number;
  yDim: number;
  numBombs: number;
  gameKey: number;
};
type BoardState = {
  board: BoardType;
  revealedCards: RevealedCards;
  gameState: GameStates;
};

function getInitialState({ xDim, yDim, numBombs }: BoardProps) {
  const board = createNewBoardWithBombs(xDim, yDim, numBombs);
  return {
    board,
    revealedCards: board.map(row => row.map(value => false)),
    gameState: gameStates.PLAYING
  };
}

function isEveryNonBombRevealed(
  board: BoardType,
  revealedCards: RevealedCards
) {
  return board.every((row, j) =>
    row.every((v, i) => v === BOMB_KEY || revealedCards[j][i])
  );
}

class Board extends React.Component<BoardProps, BoardState> {
  timeoutIds: number[];

  constructor(props: BoardProps, context: object) {
    super(props, context);

    this.timeoutIds = [];
    this.state = getInitialState(props);
    this._addCheats();
  }

  componentDidUpdate(prevProps: BoardProps) {
    if (prevProps.gameKey !== this.props.gameKey) {
      this.setState(getInitialState(this.props));
    }
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

  _revealCard = (x: number, y: number) => {
    this._revealCards([[x, y]]);
    if (this.state.board[y][x] === BOMB_KEY) {
      this.setState({
        gameState: gameStates.FAILED
      });
    }
  };

  _getNextCardsToReveal = (x: number, y: number) => {
    const { revealedCards, board } = this.state;
    const nextCardsToReveal: Array<[number, number]> = [];

    forEachSurroundingCell(board, x, y, (val, i, j) => {
      if (!revealedCards[j][i]) {
        nextCardsToReveal.push([i, j]);
      }
    });

    return nextCardsToReveal;
  };

  _revealCards = (xyLocations: Array<[number, number]>) => {
    let nextCardsToReveal: Array<[number, number]> = [];

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
          window.setTimeout(() => {
            this._revealCards(nextCardsToReveal);
          }, NEXT_REVEAL_TIMEOUT)
        );
      }

      const newState = {
        ...state,
        revealedCards: updatedRevealedCards
      };

      if (isEveryNonBombRevealed(state.board, updatedRevealedCards)) {
        newState.gameState = gameStates.SUCCEEDED;
      }

      return newState;
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
        <div className={`Board-status is-${gameState}`}>
          Status: {gameState}
        </div>
        {this.state.board.map((row, j) => {
          return (
            <div key={j} className="Board-row">
              {row.map((value, i) => (
                <Card
                  key={i}
                  value={value}
                  revealed={this.state.revealedCards[j][i]}
                  onReveal={this._revealCard}
                  testid={`card-${i}-${j}`}
                  locked={gameFinished}
                  x={i}
                  y={j}
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
