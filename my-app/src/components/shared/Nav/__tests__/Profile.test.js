import React from 'react';
import { Profile } from '../Profile';
import { render, screen } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react');

describe('Profile test suite', () => {
  const component = <Profile />;
  const setup = () => render(component);

  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: {},
      isAuthenticated: false,
      isLoading: false,
    });
  });

  afterEach(jest.clearAllMocks);

  it('should generate a snapshot', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  describe('when is not loading', () => {
    beforeEach(() => {
      useAuth0.mockReturnValue({
        user: { picture: 'test', name: 'test' },
        isAuthenticated: true,
        isLoading: false,
      });
    });

    it('should render avatar', () => {
			setup()
      expect(screen.getByLabelText('user-avatar')).toBeInTheDocument();
    });
  });

  describe('when is loading', () => {
    beforeEach(() => {
      useAuth0.mockReturnValue({
        user: {},
        isAuthenticated: false,
        isLoading: true,
      });
    });
    it('should render loading message', () => {
			setup()
      expect(screen.getByText('Loading ...')).toBeInTheDocument();
    });
  });
});
