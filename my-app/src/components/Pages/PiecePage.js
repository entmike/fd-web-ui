import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ExternalLinkIcon, ViewIcon, DownloadIcon } from '@chakra-ui/icons';
import { AiOutlineHeart, AiFillHeart, AiFillTags } from 'react-icons/ai';
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
  useBreakpointValue,
  useToast
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react'
import { DreamAuthor } from '../shared/DreamAuthor';
import { PreviewDrawer } from '../shared/PreviewDrawer';
import { dt } from '../../utils/dateUtils';

function PiecePage({ token }) {
  const IMAGE_HOST = 'https://images.feverdreams.app';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [textPrompt, setTextPrompt] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { hasCopied, onCopy } = useClipboard(textPrompt);
  const { hasCopiedTags, onCopyTags } = useClipboard(data);
  const toast = useToast()
  const params = useParams()
  const auth = useAuth0();
  const navigate = useNavigate();  
  
  function fetchPiece() {
    const uuid = params.uuid;
    
    fetch(`https://api.feverdreams.app/v2/job/${uuid}`)
      .then((response) => {
        let obj = response.json();
        return obj;
      })
      .then((actualData) => {
        if(actualData){
          actualData.dominant_color = actualData.dominant_color || [0, 0, 0];
          if(actualData.userdets.user_str === null){
            actualData.userdets = {
              user_str : actualData.str_author,
              nickname : "Unknown User"
            }
          }
          setData(actualData);
          setTextPrompt(actualData.text_prompts?actualData.text_prompts:actualData.text_prompt);
          setError(null);
        }else{
          setError(`This piece (${uuid}) does not exist.`)
        }
        
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
    console.log(auth)
    fetchPiece();
    }, [auth]);

  return (
    <>
      {error}
      {!error && <>
      <HStack mt={4} mb={4} maxW="1024" m="auto" position={'relative'}>
      {data && (data.status==="archived" || data.status==="complete" || (data.status==="processing" && data.percent !==undefined)) &&
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
              : `http://images.feverdreams.app/jpg/${data.uuid}.jpg`
          }
        />
        }
        <Skeleton isLoaded={!loading} className='w-100'>
          <Flex className="w-100" flexDirection={'column'} justifyContent="space-between" alignItems='center'>
            <Flex className="w-100" pl="2" textAlign="left" alignItems="center" justifyContent="space-between">
              <Wrap className="w-100">
                <WrapItem minWidth="360px" mr="auto!important" alignItems="center" justifyContent="left">
                  <Box>
                    <DreamAuthor userdets={(data && data.userdets)?data.userdets:{
                      user_str : data && data.str_author,
                      user_name : "New User"
                    }} />
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
                        {(data && data.userdets)?data.userdets.nickname:"Unknown User"}
                      </Heading>
                      <Button
                        colorScheme='blue'
                        variant='outline'
                        size="xs"
                        onClick={() => {
                          fetch(
                            `https://api.feverdreams.app/follow/${data.str_author}`,
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
                  <Text ml={2} mr={2}>{data && data.views}</Text>
                  <IconButton
                    isRound
                    colorScheme={'pink'}
                    size="md"
                    onClick={() => (window.location.href = ``)}
                    // ml={1}
                    isDisabled
                    icon={<AiOutlineHeart />}
                  >
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
                  <IconButton
                    isRound
                    colorScheme={'green'}
                    size="md"
                    onClick={event=>{
                      let tags = JSON.parse(JSON.stringify(data.discoart_tags))
                      delete(tags._status)
                      navigator.clipboard.writeText(JSON.stringify(tags, null, 2))
                      toast({
                        title: "DiscoArt tags copied.",
                        description: "DiscoArt tags have been copied to your clipboard.",
                        status: "success"
                      })
                    }}
                    // ml={1}
                    icon={<AiFillTags />}
                  >
                  </IconButton>                  
                  <Button
                    colorScheme={'green'}
                    size="xs"
                    onClick={() => (navigate(`/mutate/${params.uuid}`))}
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
                          : data.origin==='upload'
                          ? `${IMAGE_HOST}/images/${params.uuid}.png`
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
      {data && (data.status==="archived" || data.status==="complete" || (data.status==="processing" && data.percent !==undefined)) &&
        <Link>
        <Image
          bg={`rgb(${data.dominant_color[0]},${data.dominant_color[1]},${data.dominant_color[2]},0.5)`}
          onClick={(() => {
            let url = data.status === 'processing'
            ? `${IMAGE_HOST}/images/${params.uuid}_progress.png`
            : data.origin==='upload'
            ? `${IMAGE_HOST}/images/${params.uuid}.png`
            : `${IMAGE_HOST}/images/${params.uuid}0_0.png`
          window.open(url, "_blank")})}
          maxH="1024"
          m="auto"
          mt="3"
          mb="3"
          borderRadius="lg"
          alt={data.text_prompts?data.text_prompts:data.text_prompt}
          objectFit="cover"
          src={
            data.status === 'processing'
              ? `${IMAGE_HOST}/images/${params.uuid}_progress.png`
              : `http://images.feverdreams.app/jpg/${data.uuid}.jpg`
          }
        />
        </Link>
      }
      {data && (data.status==="rejected" || data.status==="failed") && 
      <>
        <VStack>
          <Center>
          <Code my={3} p={4} borderRadius="md" maxW="1024">{data.traceback}
          </Code>
          </Center>
          {auth && auth.isAuthenticated && data.str_author === auth.user.sub.split("|")[2] &&
        <Center>
          {(data && (data.status==="rejected" || data.status==="failed") || data.status==="queued") && <Button colorScheme={"blue"} onClick={() => {
            navigate(`/edit/${data.uuid}`)
          }}>Edit</Button>}
        {(data && (data.status==="rejected" || data.status==="failed")) && <Button colorScheme={"blue"}  isDisabled={!(data.status==="rejected" || data.status==="failed")} onClick={() => {
        fetch(
            `https://api.feverdreams.app/web/retry`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ uuid: data.uuid }),
            }
        ).then((response) => {
            return response.json();
          })
          .then((data) => {
            fetchPiece();
            return data;
          });
          }}>Retry</Button>}
          {(data.status==="rejected" || data.status==="failed" || data.status==="queued") && <Button colorScheme={"red"} isDisabled={!(data.status==="rejected" || data.status==="failed" || data.status==="queued")}  onClick={() => {
          fetch(
              `https://api.feverdreams.app/web/cancel`,
              {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ uuid: data.uuid }),
              }
            ).then((response) => {
              return response.json();
            })
            .then((data) => {
              navigate(`/myjobs/all/1`)
              return data;
            });
          }}>Cancel</Button>}
          </Center>}
        </VStack>
      </>
      }
      {data && data.percent===undefined && (data.status==="processing" || data.status==="queued") && 
        <VStack>
          <Center>
            <Code my={3} p={4} borderRadius="md" maxW="1024">Job currently {data.status}...<br/><br/>            
            Refresh the page for updates.  (Live refresh and progress updates coming "soon"...)
             { auth && auth.isAuthenticated && data.str_author === auth.user.sub.split("|")[2] && 
              <Center>
              {(data.status==="queued") && <>
                <Button colorScheme={"blue"} onClick={() => {
                  navigate(`/edit/${data.uuid}`)
                }}>Edit</Button>
              <Button colorScheme={"red"} isDisabled={!(data.status==="rejected" || data.status==="failed" || data.status==="queued")}  onClick={() => {
                fetch(
                    `https://api.feverdreams.app/web/cancel`,
                    {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ uuid: data.uuid }),
                    }
                    ).then((response) => {
                      return response.json();
                    })
                    .then((data) => {
                      navigate(`/myjobs/all/1`)
                      return data;
                    });
                  }}>Cancel</Button>
                </>
              }</Center>             
            }
            </Code>
          </Center>
          </VStack>
      }
      {data && <VStack>
        <Box>
          <Stack direction="row">
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
                if (data.results[model]) badges.push(<Badge variant="outline" colorScheme="orange">{model}</Badge>)
                return null
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
        <Link color={'green.400'} href={`https://api.feverdreams.app/v2/job/${data.uuid}`}>Metadata</Link>
      </VStack>}
    </>}
    </>
  );
}

export default PiecePage;