import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import Card from '../Card';

it('renders a button for accessibility', () => {
  const { container } = render(<Card value={5} />);
  expect(container).toBeInTheDocument();
  expect(container.querySelectorAll('button').length).toBe(1);
});

it('does not show a value by default', () => {
  const { queryByText } = render(<Card value={5} />);
  expect(queryByText('5')).not.toBeInTheDocument();
});

it('shows the value and is disabled when revealed', () => {
  const { container, getByText } = render(<Card value={5} revealed />);
  expect(getByText('5')).toBeInTheDocument();
  expect(container.querySelector('button').disabled).toBe(true);
});

it('calls onReveal on click', () => {
  const handleReveal = jest.fn();
  const { container } = render(<Card value={5} onReveal={handleReveal} />);
  fireEvent.click(container.querySelector('button'));
  expect(handleReveal).toHaveBeenCalledTimes(1);
});
