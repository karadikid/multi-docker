import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders other page link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText('Other Page');
  expect(linkElement).toBeInTheDocument();
});
