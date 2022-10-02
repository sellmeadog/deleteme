import React from 'react';
import { render } from '@testing-library/react-native';

import App from './App';

test('renders correctly', () => {
  const { toJSON } = render(<App />);
  expect(toJSON()).toMatchSnapshot();
});
