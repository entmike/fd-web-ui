import React from 'react';
import { Avatar, AvatarBadge, Box, Flex, Image, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export function Previewcaption({
  width,
  height,
  uuid,
  model,
  render_type,
  text_prompt,
  userdets,
  timestamp,
  thumbnails,
}) {
  console.log(text_prompt);
  return (
    <Flex class='preview-caption'>
      <Box pos="absolute" bottom="0" w="100%" h="80px">
        {/* <div p="3">
        <Avatar size='sm' name='Kent Dodds' src='https://bit.ly/kent-c-dodds'>
          <AvatarBadge boxSize='1.25em' bg='green.500' />
        </Avatar><br />
        <small> Render Type:  { render_type } </small><br />
        <small> Time: { timestamp } </small>
        </div> */}
      </Box>
    </Flex>
  );
}
