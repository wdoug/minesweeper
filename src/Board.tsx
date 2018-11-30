import React from 'react';
import {
  copyBoard,
  forEachSurroundingCell,
  BOMB_KEY,
  Board as BoardType
} from './utils';
import Card from './Card';
import { NEXT_REVEAL_TIMEOUT } from './config';
import './Board.css';

type RevealedCards = Array<Array<boolean>>;
type GameStates = 'PLAYING' | 'FAILED' | 'SUCCEEDED';

const gameStates: { [key: string]: GameStates } = {
  PLAYING: 'PLAYING',
  FAILED: 'FAILED',
  SUCCEEDED: 'SUCCEEDED'
};

function getInitialState(board: BoardType) {
  return {
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

type Props = {
  board: BoardType;
};
type State = {
  revealedCards: RevealedCards;
  gameState: GameStates;
};

class Board extends React.Component<Props, State> {
  timeoutIds: number[];

  constructor(props: Props, context: object) {
    super(props, context);

    this.timeoutIds = [];
    this.state = getInitialState(props.board);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.board !== this.props.board) {
      this.setState(getInitialState(this.props.board));
    }
  }

  _getRevealCardCallback = (x: number, y: number) => () => {
    this._revealCards([[x, y]]);
    if (this.props.board[y][x] === BOMB_KEY) {
      this.setState({
        gameState: gameStates.FAILED
      });
    }
  };

  _getNextCardsToReveal = (x: number, y: number) => {
    const { revealedCards } = this.state;
    const nextCardsToReveal: Array<[number, number]> = [];

    forEachSurroundingCell(this.props.board, x, y, (val, i, j) => {
      if (!revealedCards[j][i]) {
        nextCardsToReveal.push([i, j]);
      }
    });

    return nextCardsToReveal;
  };

  _revealCards = (xyLocations: Array<[number, number]>) => {
    let nextCardsToReveal: Array<[number, number]> = [];

    this.setState((state, props) => {
      const updatedRevealedCards = copyBoard(state.revealedCards);
      xyLocations.forEach(([x, y]) => {
        if (!updatedRevealedCards[y][x]) {
          updatedRevealedCards[y][x] = true;

          if (props.board[y][x] === 0) {
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

      if (isEveryNonBombRevealed(this.props.board, updatedRevealedCards)) {
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
