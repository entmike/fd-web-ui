import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { IconButton, Icon } from "@chakra-ui/react";
import { CgProfile } from 'react-icons/cg'

 const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return <IconButton onClick={() => loginWithRedirect()} aria-label={`Log In`} icon={< Icon as={CgProfile} />} />
};

export default LoginButton;