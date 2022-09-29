import {
    Image,
    Text,
    HStack,
  } from '@chakra-ui/react';

export const PieceAuthor = (props) => {
    return (
      <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
        <Image
          borderRadius="full"
          boxSize="40px"
          src="https://100k-faces.glitch.me/random-image"
          alt={`Avatar of ${props.name}`}
        />
        <Text fontWeight="medium">{props.name}</Text>
        <Text>—</Text>
        <Text>{props.date.toLocaleDateString()}</Text>
      </HStack>
    );
  };