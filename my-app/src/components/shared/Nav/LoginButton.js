import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { IconButton, Icon } from '@chakra-ui/react';
import { CgProfile } from 'react-icons/cg';

const buttonIcon = <Icon as={CgProfile} />;

export function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  const handleRedirect = () => loginWithRedirect();

  return (
    <IconButton
      onClick={handleRedirect}
      aria-label="Log In"
      icon={buttonIcon}
    />
  );
}
