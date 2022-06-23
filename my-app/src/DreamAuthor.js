import React from "react"
import {
    Image,
    Text,
    HStack,
  } from '@chakra-ui/react';

export default function DreamAuthor(props) {
    return (
      <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
        <Image
          borderRadius="full"
          boxSize="40px"
          src={props.avatar?props.avatar:"/avatar-placeholder.gif"}
          alt={`Avatar of ${props.name}`}
        />
        <Text fontWeight="medium">{props.name}</Text>
      </HStack>
    );
  };