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
  Code,
  Button,
  HStack,
  VStack,
  useClipboard,
  Skeleton,
} from '@chakra-ui/react';
import { DreamAuthor } from './shared/DreamAuthor';
import { dt } from '../utils/dateUtils';

export function Piece() {
  // const IMAGE_HOST = "http://www.feverdreams.app.s3-website-us-east-1.amazonaws.com"
  const IMAGE_HOST = 'https://www.feverdreams.app';
  const [data, setData] = useState({
    userdets: {},
    dominant_color: [0, 0, 0],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tp, setTP] = useState('');
  const { hasCopied, onCopy } = useClipboard(tp);
  let params = useParams();

  function fetchPiece() {
    let uuid = params.uuid;
    fetch(`https://api.feverdreams.app/job/${uuid}`)
      .then((response) => {
        let obj = response.json();
        return obj;
      })
      .then((actualData) => {
        actualData.dominant_color = actualData.dominant_color || [0, 0, 0];
        setData(actualData);
        setTP(actualData.text_prompt);
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
      <div>
        <VStack alignItems={'left'} paddingLeft={3} paddingRight={3}>
          <VStack>
            <HStack>
              <Skeleton isLoaded={!loading}>
                <DreamAuthor userdets={data.userdets} />
              </Skeleton>
              <Skeleton isLoaded={!loading}>
                <Heading as="h3" size="lg">
                  {params.uuid}
                </Heading>
              </Skeleton>
            </HStack>
            <Link
              textDecoration="none"
              isExternal
              href={
                data.status === 'processing'
                  ? `${IMAGE_HOST}/images/${params.uuid}_progress.png`
                  : `${IMAGE_HOST}/images/${params.uuid}0_0.png`
              }
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
                    : `${IMAGE_HOST}/images/${params.uuid}0_0.png`
                }
              />
            </Link>
            <Stack direction="row">
              <Badge variant="outline" colorScheme="green">
                {data.model}
              </Badge>
              <Badge variant="outline" colorScheme="green">
                {data.render_type}
              </Badge>
              <Badge
                variant="outline"
                colorScheme="green"
              >{`${data.steps} steps`}</Badge>
              <Badge variant="outline" colorScheme="blue">
                {data.views} Views
              </Badge>
            </Stack>
            <VStack>
              <Code
                width="80%"
                variant={'solid'}
                p={8}
                borderRadius="sm"
                borderWidth="1px"
                bg={`rgb(${data.dominant_color[0]},${data.dominant_color[1]},${data.dominant_color[2]},0.5)`}
              >
                {tp}
              </Code>
              <Button onClick={onCopy} ml={2}>
                {hasCopied ? 'Copied' : 'Copy Text Prompt'}
              </Button>
            </VStack>
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
            <Text>{dt(data.timestamp)}</Text>
          </VStack>
        </VStack>
      </div>
    </>
  );
}
