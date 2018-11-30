import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import Card from '../Card';

function getCardButton(container: HTMLElement) {
  const cardBtn = container.querySelector('button');
  if (!cardBtn) {
    throw new Error('No Card button to click');
  }
  return cardBtn;
}

function renderCard(ui = <Card value={5} onReveal={() => {}} />) {
  return render(ui);
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
  const { container, getByText } = renderCard(
    <Card value={5} revealed onReveal={() => {}} />
  );
  expect(getByText('5')).toBeInTheDocument();
  expect(getCardButton(container).disabled).toBe(true);
});

it('calls onReveal on click', () => {
  const handleReveal = jest.fn();
  const { container } = renderCard(<Card value={5} onReveal={handleReveal} />);
  fireEvent.click(getCardButton(container));
  expect(handleReveal).toHaveBeenCalledTimes(1);
});

it('disables the button when locked', () => {
  const { container } = renderCard(
    <Card value={5} locked onReveal={() => {}} />
  );
  expect(getCardButton(container).disabled).toBe(true);
});
