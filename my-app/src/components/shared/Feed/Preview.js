import React from 'react';
import { Box, Image, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Previewcaption } from './Previewcaption';

export function Preview({ uuid, thumbnails }) {
  return (
    <Box pos="relative" borderRadius="lg" overflow="hidden">
      <Link to={`/piece/${uuid}`}>
        <Image
          src={`http://images.feverdreams.app/thumbs/1024/${uuid}.jpg`}
          alt={uuid}
          transition="0.3s ease-in-out"
          // objectFit="contain"
          style={{ objectFit: 'cover' }}
          _hover={{ transform: 'scale(1.1)' }}
        />
      </Link>
    </Box>
  );
}
