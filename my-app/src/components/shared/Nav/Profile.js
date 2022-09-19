import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, AvatarBadge } from '@chakra-ui/react';

export function Profile({myInfo}) {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && <>
      <Avatar size={'sm'} src={user.picture} alt={user.name}>
        {myInfo && myInfo.reviews > 0 && 
          <AvatarBadge boxSize='1.25em' bg='red.500'><small>{myInfo.reviews}</small></AvatarBadge>
        }
      </Avatar>
    </>
  );
}
