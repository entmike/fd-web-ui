import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLinkIcon, ViewIcon, DownloadIcon } from '@chakra-ui/icons';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MdIosShare } from "react-icons/md";
import {
  Heading,
  Link,
  Image,
  Icon,
  IconButton,
  IconProps,
  Badge,
  Stack,
  Flex,
  HStack,
  Code,
  Button,
  Box,
  VStack,
  useClipboard,
  Skeleton,
  Center,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Wrap,
  WrapItem,
  Modal,
  Spacer,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ButtonGroup,
  useBreakpointValue
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react'
import { DreamAuthor } from '../shared/DreamAuthor';
import { PreviewDrawer } from '../shared/PreviewDrawer';
import { dt } from '../../utils/dateUtils';

function PiecePage({ token }) {
  const IMAGE_HOST = 'https://images.feverdreams.app';

  const [data, setData] = useState({
    userdets: {},
    dominant_color: [0, 0, 0],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [textPrompt, setTextPrompt] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure()
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
        setTextPrompt(actualData.text_prompts?actualData.text_prompts:actualData.text_prompt);
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
      <HStack mt={4} mb={4} maxW="1024" m="auto" position={'relative'}>
      <Image
          bg={`rgb(${data.dominant_color[0]},${data.dominant_color[1]},${data.dominant_color[2]},0.5)`}
          position={'absolute'}
          top={-10}
          left={-10}
          right={-10}
          bottom={-10}
          style={{
            filter: 'blur(70px)',
            zIndex: '-1',
            transform: 'scale(2.0)'
          }}
          objectFit="contain"
          src={
            data.status === 'processing'
              ? `${IMAGE_HOST}/images/${params.uuid}_progress.png`
              : !data.thumbnails
                ? `${IMAGE_HOST}/images/${params.uuid}0_0.png`
                : `http://images.feverdreams.app/thumbs/1024/${data.uuid}.jpg`
          }
        />
        <Skeleton isLoaded={!loading} className='w-100'>
          <Flex className="w-100" flexDirection={'column'} justifyContent="space-between" alignItems='center'>
            <Flex className="w-100" pl="2" textAlign="left" alignItems="center" justifyContent="space-between">
              <Wrap className="w-100">
                <WrapItem minWidth="360px" mr="auto!important" alignItems="center" justifyContent="left">
                  <Box>
                    <DreamAuthor userdets={data.userdets} />
                  </Box>
                  <Box>
                    <Heading as="h4" size="sm">
                      {params.uuid}
                    </Heading>
                    {data && data.timestamp && (()=>{
                      return <Text fontSize={"xs"}>
                        {dt(data.timestamp)}
                      </Text>
                    })()}
                    <Flex alignItems="center">
                      <Heading as="h5" pr="2" size="xs">
                        {data.userdets.user_name}
                      </Heading>
                      <Button
                        colorScheme='blue'
                        variant='outline'
                        size="xs"
                        onClick={() => {
                          fetch(
                            `https://api.feverdreams.app/follow/${data.userdets.user_id_str}`,
                            {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                        }}
                      >
                        Follow
                      </Button>
                    </Flex>
                  </Box>
                </WrapItem>
                <WrapItem
                  justifyContent="flex-end"
                  alignItems="center">
                  <ViewIcon />
                  <Text ml={2} mr={2}>{data.views}</Text>
                  <IconButton
                    isRound
                    colorScheme={'pink'}
                    size="md"
                    onClick={() => (window.location.href = ``)}
                    // ml={1}
                    isDisabled
                    icon={<AiOutlineHeart />}
                  >
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="heroicons-md" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg> */}
                  </IconButton>
                  <IconButton
                    isRound
                    colorScheme={'purple'}
                    size="md"
                    onClick={() => (window.location.href = ``)}
                    // ml={1}
                    isDisabled
                    icon={<MdIosShare />}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="heroicons-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </IconButton>
                  <Button
                    colorScheme={'green'}
                    size="xs"
                    onClick={() => (window.location.href = `/mutate/${params.uuid}`)}
                    ml={1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="heroicons-md" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                    </svg>
                    Mutate
                  </Button>
                  <Button
                    colorScheme={'green'}
                    size="xs"
                    onClick={() => {
                          let url = data.status === 'processing'
                          ? `${IMAGE_HOST}/images/${params.uuid}_progress.png`
                          : `${IMAGE_HOST}/images/${params.uuid}0_0.png`
                        window.open(url, "_blank")
                        // const link = document.createElement('a')
                        // link.setAttribute('href', `https://images.feverdreams.app/images/${params.uuid}0_0.png`)
                        // link.setAttribute('download', `${params.uuid}0_0.png`)
                      
                        // if (document.createEvent) {
                        //   const event = document.createEvent('MouseEvents')
                        //   event.initEvent('click', true, true)
                        //   link.dispatchEvent(event)
                        // } else {
                        //   link.click()
                        // }
                      }
                    }
                    ml={1}
                  ><DownloadIcon />Download</Button>
                </WrapItem>
              </Wrap>
            </Flex>
          </Flex>
        </Skeleton>
      </HStack>
        <Link>
        <Image
          bg={`rgb(${data.dominant_color[0]},${data.dominant_color[1]},${data.dominant_color[2]},0.5)`}
          onClick={(() => {
            console.log(data)
            let url = data.status === 'processing'
            ? `${IMAGE_HOST}/images/${params.uuid}_progress.png`
            : `${IMAGE_HOST}/images/${params.uuid}0_0.png`
          window.open(url, "_blank")})}
          maxH="1024"
          m="auto"
          mt="3"
          mb="3"
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
      <VStack>
        <Box>
          <Stack direction="row">
            {data.experimental && <Badge variant="outline" colorScheme="blue">🧪 Experimental</Badge>}
            <Badge variant="outline" colorScheme="blue">
              {data.status}
            </Badge>
            <Badge variant="outline" colorScheme="blue">
              {data.percent} % Complete
            </Badge>
            <Badge variant="outline" colorScheme="blue">
              Seed: {data.results?data.results.seed:"?"}
            </Badge>
          </Stack>
        </Box>
        <Code className="copy-prompt-container" my={3} p={4} pb={12} borderRadius="md" maxW="1024">
          {textPrompt}
          <Button className="copy-prompt-btn" size="sm" colorScheme={'gray'} onClick={onCopy} ml={2}>
            {hasCopied ? 'Copied' : 'Copy Text Prompt'}
          </Button>
        </Code>
        <Box>
          <HStack>
            {data && data.results && (()=>{
              let badges = []
              const clip_models = ["RN101","RN50","RN50x16","RN50x4","RN50x64","ViTB16","ViTB32","ViTL14","ViTL14_336"]
              clip_models.map((model)=>{
                console.log(model)
                if (data.results[model]) badges.push(<Badge variant="outline" colorScheme="orange">{model}</Badge>)
              })
              return badges
            })()}
            </HStack>
          </Box>
        <Box>
          <HStack>
            {data && data.results && (()=>{
              return <Badge variant="outline" colorScheme="green">
                {data.results.width_height[0]}x{data.results.width_height[1]}
              </Badge>
            })()}
            {/* <Badge variant="outline" colorScheme="green">
              {data.render_type}
            </Badge> */}
            <Badge variant="outline" colorScheme="green">
              Steps: {data.steps}
            </Badge>
            {data && data.results && (()=>{
              return <Badge variant="outline" colorScheme="green">
                ETA: {data.results.eta}
              </Badge>
            })()}
            {data && data.results && (()=>{
              return <Badge variant="outline" colorScheme="green">
                cut_ic_pow: {data.results.cut_ic_pow}
              </Badge>
            })()}
            {data && data.results && (()=>{
              return <Badge variant="outline" colorScheme="green">
                clip_guidance_scale: {data.results.clip_guidance_scale}
              </Badge>
            })()}
          </HStack>
        </Box>
        <Link color={'green.400'} href={`https://api.feverdreams.app/job/${data.uuid}`}>Metadata</Link>
      </VStack>
    </>
  );
}

export default PiecePage;