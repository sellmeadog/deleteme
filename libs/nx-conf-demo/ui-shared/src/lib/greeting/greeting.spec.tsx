import React from 'react';
import { render } from '@testing-library/react-native';

import { Greeting } from './greeting';

describe('Greeting', () => {
  it('should render successfully', () => {
    const { toJSON } = render(<Greeting />);
    expect(toJSON()).toMatchSnapshot();
  });
});
