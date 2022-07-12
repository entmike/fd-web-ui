import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Heading, Button, VStack, Flex } from '@chakra-ui/react';

export function DreamAuthor(props) {
  console.log(props);
  return (
    <Link to={`/gallery/${props.userdets.user_str}/1`}>
      <Flex mt="3" mb="3">
        <Image
          borderRadius="full"
          boxSize="60px"
          mr="3"
          src={
            props.userdets.avatar
              ? props.userdets.avatar
              : '/avatar-placeholder.gif'
          }
          alt={`Avatar of ${props.userdets.user_name}`}
        />
      </Flex>
    </Link>
  );
}
