import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import Card, { CardProps } from '../Card';

function getCardButton(container: HTMLElement) {
  const cardBtn = container.querySelector('button');
  if (!cardBtn) {
    throw new Error('No Card button to click');
  }
  return cardBtn;
}

const standardProps = {
  value: 5,
  onReveal: () => {},
  x: 0,
  y: 0
};

function renderCard(propOverrides?: Partial<CardProps>) {
  return render(<Card {...standardProps} {...propOverrides} />);
}

it('renders a button for accessibility', () => {
  const { container } = renderCard();
  expect(container).toBeInTheDocument();
  expect(container.querySelectorAll('button').length).toBe(1);
});

it('does not show a value by default', () => {
  const { queryByText } = renderCard();
  expect(queryByText('5')).not.toBeInTheDocument();
});

it('shows the value and is disabled when revealed', () => {
  const { container, getByText } = renderCard({ revealed: true });
  expect(getByText('5')).toBeInTheDocument();
  expect(getCardButton(container)).toBeDisabled();
});

it('calls onReveal on click', () => {
  const handleReveal = jest.fn();
  const { container } = renderCard({ onReveal: handleReveal });
  fireEvent.click(getCardButton(container));
  expect(handleReveal).toHaveBeenCalledTimes(1);
});

it('disables the button when locked', () => {
  const { container } = renderCard({ locked: true });
  expect(getCardButton(container)).toBeDisabled();
});
