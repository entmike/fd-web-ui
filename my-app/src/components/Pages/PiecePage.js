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
  Center,
  Flex,
  HStack,
  Code,
  Button,
  Box,
  VStack,
  useClipboard,
  Skeleton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react'
import { DreamAuthor } from '../shared/DreamAuthor';
import { PreviewDrawer } from '../shared/PreviewDrawer';
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
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {error}
      <Flex className='piece-container' justifyContent={'center'} display={{ lg: 'flex' }}>
        <Link
          onClick={onOpen}
          textDecoration="none"
          isExternal
          // href={
          //   data.status === 'processing'
          //     ? `${IMAGE_HOST}/images/${params.uuid}_progress.png`
          //     : `${IMAGE_HOST}/images/${params.uuid}0_0.png`
          // }
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
        <VStack className="piece-details" alignItems={'between'}>
          <Flex minWidth='max-content'>
            <Box pt='4' mb="0">
              <Skeleton isLoaded={!loading}>
                <Heading as="h1" pt="2" pb="1" size="lg">
                  Artwork Name
                </Heading>
                <Heading as="h2" pt="1" pb="2" size="sm">
                  {params.uuid}
                </Heading>
              </Skeleton>
            </Box>
          </Flex>
          <Flex minWidth='max-content'>
            <Center w="80px" pt='2' mb="2">
              <svg xmlns="http://www.w3.org/2000/svg" className="heroicons-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <Text> {data.steps} </Text>
            </Center>
            <Center w="80px" pt='2' mb="2">
              <svg xmlns="http://www.w3.org/2000/svg" className="heroicons-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <Text> {data.views} </Text>
            </Center>
            <Center w="80px" pt='2' mb="2">
              <svg xmlns="http://www.w3.org/2000/svg" className="heroicons-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <Text> {data.views} </Text>
            </Center>
          </Flex>
          <Flex>
            <Center w="200px" pt='2' mb="2">
              <svg xmlns="http://www.w3.org/2000/svg" class="heroicons-sm opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Text className='opacity-50'>{new Date(dt(data.timestamp)).toLocaleString()}</Text>
            </Center>
          </Flex>
          <DreamAuthor userdets={data.userdets} />
          <VStack class="w-100">
            <Code p={4} borderRadius="md" maxW="800">
              {textPrompt}
            </Code>
            <Flex mb="5" class="w-100">
              <Box pt='2' mb="0" w="100%">
                <Button colorScheme={'green'} onClick={onCopy} ml={2}>
                  {hasCopied ? 'Copied' : 'Copy Text Prompt'}</Button>
                <Button colorScheme={'gray'} onClick={() => window.location.href = `/mutate/${params.uuid}`} ml={2}>
                  Mutate this piece</Button>
              </Box>
            </Flex>
          </VStack>
          <Flex mb="5">
            <Center w="40px">
              <svg xmlns="http://www.w3.org/2000/svg" className="heroicons-sm opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </Center>
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
            </Stack>
          </Flex>
          <Stack pt="3" mb="5" direction="row">
            <Link
              isExternal
              color="green.500"
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
          <PreviewDrawer />
        </VStack>
        <Modal
          className="piece-modal"
          isOpen={isOpen}
          onClose={onClose}
          size="full"
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image
                src={`http://images.feverdreams.app/images/${params.uuid}0_0.png`}
                alt={`${params.uuid}`}
                transition="0.3s ease-in-out"
                // objectFit="contain"
                style={{ objectFit: 'contain' }} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
}

export default PiecePage;
