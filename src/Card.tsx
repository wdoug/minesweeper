import React from 'react';
import './Card.css';

export type CardProps = {
  value: number | string;
  revealed?: boolean;
  onReveal: (x: number, y: number) => void;
  testid?: string;
  locked?: boolean;
  x: number;
  y: number;
};

const Card: React.SFC<CardProps> = ({
  value,
  revealed,
  onReveal,
  testid,
  locked,
  x,
  y
}) => {
  return (
    <div className="Card-wrapper">
      <div
        className={`Card ${revealed ? 'is-revealed' : ''}`}
        data-testid={testid}
      >
        <button
          className="Card-front"
          onClick={() => onReveal(x, y)}
          disabled={revealed || locked}
        />
        <div className="Card-back">{(revealed && value) || ''}</div>
      </div>
    </div>
  );
};

export default Card;
