import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Heading, Box, Center, VStack } from '@chakra-ui/react';

export function DreamAuthor(props) {
  console.log(props);
  return (
    <Link to={`/gallery/${props.userdets.user_str}/1`}>
      <VStack mb={1}>
        <Image
          borderRadius="full"
          boxSize="60px"
          src={
            props.userdets.avatar
              ? props.userdets.avatar
              : '/avatar-placeholder.gif'
          }
          alt={`Avatar of ${props.userdets.user_name}`}
        />
        <Heading as="h3" size="md">
          {props.userdets.user_name}
        </Heading>
      </VStack>
    </Link>
  );
}
