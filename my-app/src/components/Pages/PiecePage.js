import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Heading,
  Link,
  Image,
  Text,
  Badge,
  Stack,
  Flex,
  Code,
  Button,
  Box,
  VStack,
  useClipboard,
  Skeleton,
} from '@chakra-ui/react';
import { DreamAuthor } from '../shared/DreamAuthor';
import { dt } from '../../utils/dateUtils';

function PiecePage() {
  const IMAGE_HOST = 'https://images.feverdreams.app';

  const [data, setData] = useState({
    userdets: {},
    dominant_color: [0, 0, 0],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [textPrompt, setTextPrompt] = useState('');

  const { hasCopied, onCopy } = useClipboard(textPrompt);

  const params = useParams();

  function fetchPiece() {
    const uuid = params.uuid;

    fetch(`https://api.feverdreams.app/job/${uuid}`)
      .then((response) => {
        let obj = response.json();
        return obj;
      })
      .then((actualData) => {
        actualData.dominant_color = actualData.dominant_color || [0, 0, 0];
        setData(actualData);
        setTextPrompt(actualData.text_prompt);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchPiece();
  }, []);

  return (
    <>
      {error}
      <Link
        textDecoration="none"
        isExternal
        href={
          data.status === 'processing'
            ? `${IMAGE_HOST}/images/${params.uuid}_progress.png`
            : `${IMAGE_HOST}/images/${params.uuid}0_0.png`
        }
        pb={6}
      >
        <Image
          bg={`rgb(${data.dominant_color[0]},${data.dominant_color[1]},${data.dominant_color[2]},0.5)`}
          maxH="768"
          borderRadius="lg"
          alt={data.text_prompt}
          objectFit="cover"
          src={
            data.status === 'processing'
              ? `${IMAGE_HOST}/images/${params.uuid}_progress.png`
              : !data.thumbnails
                ? `${IMAGE_HOST}/images/${params.uuid}0_0.png`
                : `http://images.feverdreams.app/thumbs/1024/${data.uuid}.jpg`
          }
        />
      </Link>
      <VStack alignItems={'between'}>
        <Flex minWidth='max-content' alignItems='center'>
          <Box pt='4' mb="2">
            <Skeleton isLoaded={!loading}>
            <Heading as="h1" pt="2" pb="1" size="lg">
                Artwork Name
              </Heading>
              <Heading as="h2" pt="1" pb="2" size="sm">
                {params.uuid}
              </Heading>
              <DreamAuthor userdets={data.userdets} />
            </Skeleton>
          </Box>
        </Flex>

        <Stack direction="row">
          <Badge variant="outline" colorScheme="green">
            {data.model}
          </Badge>
          <Badge variant="outline" colorScheme="green">
            {data.render_type}
          </Badge>
          <Badge variant="outline" colorScheme="green">
            {data.steps} steps
          </Badge>
          <Badge variant="outline" colorScheme="blue">
            {data.views} Views
          </Badge>
        </Stack>

<<<<<<< HEAD
       
          <Flex minWidth='max-content' alignItems='center'>
            <Code p={4} borderRadius="md" maxW="440px">
              {textPrompt}
            </Code>
          </Flex>
          <Flex minWidth='max-content' alignItems='center'>
            <Button colorScheme='teal' onClick={onCopy} mr={2}>
              {hasCopied ? 'Copied' : 'Copy Text Prompt'}
            </Button>
            <Button colorScheme={'gray'} >Mutate This Piece</Button>
          </Flex>
=======
        <VStack>
          <Code p={4} borderRadius="md" maxW="800">
            {textPrompt}
          </Code>
            <HStack>
            <Button colorScheme={'gray'} onClick={onCopy} ml={2}>
              {hasCopied ? 'Copied' : 'Copy Text Prompt'}</Button>
            <Button colorScheme={'green'} onClick={()=>window.location.href=`/mutate/${params.uuid}`} ml={2}>
              Mutate</Button>
            </HStack>
        </VStack>
>>>>>>> 099f6beed3f5b06365ce6b5d16e5905e8d75978d

        <Stack direction="row">
          <Link
            color="green.500"
            isExternal
            href={`https://api.feverdreams.app/job/${params.uuid}`}
          >
            Job Details <ExternalLinkIcon mx="2px" />
          </Link>{' '}
          |{' '}
          <Link
            color="green.500"
            isExternal
            href={`https://api.feverdreams.app/config/${params.uuid}`}
          >
            YAML <ExternalLinkIcon mx="2px" />
          </Link>
        </Stack>
        <Text>{new Date(dt(data.timestamp)).toLocaleString()}</Text>
      </VStack>
    </>
  );
}

export default PiecePage;
