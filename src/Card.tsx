import React from 'react';
import './Card.css';

type Props = {
  value: number | string;
  revealed?: boolean;
  onReveal: () => void;
  testid?: string;
  locked?: boolean;
};

const Card: React.SFC<Props> = ({
  value,
  revealed,
  onReveal,
  testid,
  locked
}) => {
  return (
    <div className="Card-wrapper">
      <div
        className={`Card ${revealed ? 'is-revealed' : ''}`}
        data-testid={testid}
      >
        <button
          className="Card-front"
          onClick={onReveal}
          disabled={revealed || locked}
        />
        <div className="Card-back">{(revealed && value) || ''}</div>
      </div>
    </div>
  );
};

export default Card;
