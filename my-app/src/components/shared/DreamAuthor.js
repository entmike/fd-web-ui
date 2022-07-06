import React from "react"
import { Link } from "react-router-dom";
import {
    Image,
    Text, Heading, Box, Center,
    VStack,
  } from '@chakra-ui/react';

export function DreamAuthor(props) {
    return (
      <Box>
        <Center>
          <VStack marginTop="2" spacing="2" display="inline-block" width="100%">
              <Link to={`/gallery/${props.userdets.user_str}/25/1`}>
                  <Image
                    borderRadius="full"
                    boxSize="60px"
                    src={props.userdets.avatar?props.userdets.avatar:"/avatar-placeholder.gif"}
                    alt={`Avatar of ${props.userdets.user_name}`}
                  />
                  <Text>{props.userdets.user_name}</Text>
              </Link>
          </VStack>
        </Center>
      </Box>
    );
  };