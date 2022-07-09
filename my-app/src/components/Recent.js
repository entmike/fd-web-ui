import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Text, Flex, Center } from '@chakra-ui/react';
import { Icon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Feed } from './shared/Feed';

export function Recent() {
  let params = useParams();

  return (
    <>
      <Center>
        <Flex marginBottom={3}>
          <Link
            to={`/recent/${params.amount}/${parseInt(
              parseInt(params.page) - 1
            )}`}
          >
          <Button variant='outline' colorScheme='blue'> <ArrowBackIcon /></Button>
          </Link>
          <Center marginLeft={2} marginRight={2}>
            <Text>{params.page}</Text>
          </Center>
          <Link
            to={`/recent/${params.amount}/${parseInt(
              parseInt(params.page) + 1
            )}`}
          >
            <Button variant='outline' colorScheme='blue'> <ArrowForwardIcon /></Button>
          </Link>
        </Flex>
      </Center>
      <Feed
        type="recent"
        regexp={params.regexp}
        amount={params.amount}
        page={1}
      />
      <Center>
        <Flex marginTop={3}>
          <Link
            to={`/recent/${params.amount}/${parseInt(
              parseInt(params.page) - 1
            )}`}
          >
          <Button variant='outline' colorScheme='blue'> <ArrowBackIcon /></Button>
          </Link>
          <Center marginLeft={2} marginRight={2}>
            <Text>{params.page}</Text>
          </Center>
          <Link
            to={`/recent/${params.amount}/${parseInt(
              parseInt(params.page) + 1
            )}`}
          >
          <Button variant='outline' colorScheme='blue'> <ArrowForwardIcon /></Button>
          </Link>
        </Flex>
      </Center>
    </>
  );
}
