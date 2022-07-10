import React from 'react';

import { LoginButton } from '../LoginButton';
import { useAuth0 } from '@auth0/auth0-react';
import { fireEvent, render } from '@testing-library/react';

jest.mock('@auth0/auth0-react');

describe('LoginButton test suite', () => {
  const component = <LoginButton />;
  const setup = () => render(component);

  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: {},
      loginWithRedirect: jest.fn(),
    });
  });

  it('should render an snapshot', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  it('should call loginWithRedirect on click event', () => {
    const { getByLabelText } = setup();
    const button = getByLabelText('Log In');
    fireEvent.click(button);
    expect(useAuth0().loginWithRedirect).toHaveBeenCalledTimes(1);
    expect(useAuth0().loginWithRedirect).toHaveBeenCalledWith();
  });
});
