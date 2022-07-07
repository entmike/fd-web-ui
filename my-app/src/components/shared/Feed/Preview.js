import React from 'react';
import { Box, Image, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export function Preview({
  width,
  height,
  uuid,
  dominant_color,
  model,
  render_type,
  text_prompt,
  duration,
  userdets,
  timestamp,
  thumbnails,
}) {
  return (
    <Box
      width={width}
      height={height}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={`rgb(${dominant_color[0]},${dominant_color[1]},${dominant_color[2]},0.5)`}
    >
      <HStack>
        <Link to={`/piece/${uuid}`}>
          <Image
            width={width}
            height={height}
            src={
              !thumbnails
                ? `https://api.feverdreams.app/thumbnail/${uuid}/1024`
                : `http://images.feverdreams.app/thumbs/1024/${uuid}.jpg`
            }
            alt={uuid}
            transition="0.3s ease-in-out"
            // objectFit="contain"
            style={{ objectFit: 'cover' }}
            _hover={{ transform: 'scale(1.1)' }}
          />
        </Link>
      </HStack>
    </Box>
  );
}
