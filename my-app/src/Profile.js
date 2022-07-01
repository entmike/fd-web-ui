import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Avatar} from '@chakra-ui/react';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <Avatar
        size={'sm'}
        src={user.picture} alt={user.name}
      />
    )
  );
};

export default Profile;