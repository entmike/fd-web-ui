import React from 'react';
import { useState, useEffect } from 'react';
// import { useState } from 'react-usestateref'
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLinkIcon, ViewIcon, DownloadIcon } from '@chakra-ui/icons';
import { AiOutlineHeart, AiFillHeart, AiFillTags } from 'react-icons/ai';
import { MdIosShare } from "react-icons/md";
import { useAuth0 } from '@auth0/auth0-react';
import FeedGrid from '../shared/Feed/FeedGrid';

import {
  NumberInput,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
  Select,
  TabPanel,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  Heading,
  SimpleGrid,
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
  FormControl,
  FormLabel,
  Switch,
  Modal,
  Spacer,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ButtonGroup,
  useBreakpointValue,
  useToast,
  background
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react'
import { DreamAuthor } from '../shared/DreamAuthor';
import { PreviewDrawer } from '../shared/PreviewDrawer';
import { dt } from '../../utils/dateUtils';

function PiecePage({ isAuthenticated, token, user}) {
  const IMAGE_HOST = 'https://images.feverdreams.app';
  const { loginWithRedirect } = useAuth0();
  const [data, setData] = useState(null);
  const [augmentation, setAugmentation] = useState(null);
  const [related, setRelated] = useState(null);
  const [isPinned, setIsPinned] = useState(false);
  const [delta, setDelta] = useState(0)
  const [mutateEndpoint, setMutateEndpoint] = useState('/mutate');
  const [upscaleEndpoint, setUpscaleEndpoint] = useState(`${process.env.REACT_APP_api_url}/upscale`);
  const [nsfwEndpoint, setNSFWEndpoint] = useState(`${process.env.REACT_APP_api_url}/reportnsfw`);
  const [editEndpoint, setEditEndpoint] = useState('/edit');
  const [loading, setLoading] = useState(true);
  const [pinLoading, setPinLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [error, setError] = useState(null);
  const [textPrompt, setTextPrompt] = useState([]);
  const [seed, setSeed] = useState(0);
  const [steps, setSteps] = useState(0);
  const [shareURL, setShareURL] = useState(window.location.href);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { hasCopied, onCopy } = useClipboard(textPrompt);
  const { hasCopiedTags, onCopyTags } = useClipboard(data);
  const { hasCopiedURL, onCopyURL } = useClipboard(shareURL);
  const toast = useToast()
  const params = useParams()
  const navigate = useNavigate();  
  
  function fetchPiece() {
    const uuid = params.uuid;
    let headers
    if (token) {
      headers = {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
      }
    }else{
      // console.log("Not logged in")
    }
    fetch(`${process.env.REACT_APP_api_url}/v3/job/${uuid}`, {headers})
      .then((response) => {
        let obj = response.json();
        return obj;
      })
      .then((actualData) => {
        if(actualData){
          actualData.dominant_color = actualData.dominant_color || [0, 0, 0];
          if(actualData.pinned){
            setIsPinned(true)
          }else{
            setIsPinned(false)
          }
          if(actualData.userdets.user_str === null){
            actualData.userdets = {
              user_str : actualData.str_author,
              nickname : "Unknown User"
            }
          }
          if(!actualData.algo) actualData.algo="disco"
          actualData.images = []
          actualData.images.push({
            label : "Original",
            hash : actualData.uuid
          })
          if(actualData.augs) {
            actualData.augs.map((aug, index)=>{
              if(aug.status==="complete"){
                actualData.images.push({
                  label : `Augmentation ${(index+1)}`,
                  hash : aug.augid,
                  params : aug.params
                })
              }
            })
          }
          actualData.selectedTab = 0
          actualData.images.map((image, index)=>{
            if(image.hash===actualData.preferredImage) actualData.selectedTab = index
          })
          setData(actualData);
          
          if(actualData.algo === "stable"){
            if(actualData.params){
              setTextPrompt(actualData.params.prompt);
              setSeed(actualData.params.seed);
              setSteps(actualData.params.steps);
            }else{
              setTextPrompt("Private");
              setSeed("Private");
              setSteps("Private");
            }
          }else{
            setTextPrompt(actualData.text_prompts?actualData.text_prompts:actualData.text_prompt);
            if(actualData.results){
              setSeed(actualData.results.seed)
            }
            if(actualData.discoart_tags){
              setSeed(actualData.discoart_tags.seed)
            }
          }
          setError(null);
        }else{
          setError(`This piece (${uuid}) does not exist.`)
        }
        return actualData
      })
      .then((actualData)=>{
        fetch(`${process.env.REACT_APP_api_url}/v3/related/${actualData.uuid}/10/1`, {headers})
        .then((response) => {
          let obj = response.json();
          return obj;
        })
        .then(relatedData=>{
          setRelated(relatedData)
        })
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
    }, [token, user, isAuthenticated, params.uuid]);
  
  useEffect(()=>{
    if(isModified){
      update()
      setIsModified(false)
    }
  },[data])

  async function reportNSFW() {
    setLoading(true)
    const { success, message } = await fetch(
      nsfwEndpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          job: data 
        }),
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setLoading(false);
      return data;
    })
    .catch(error=>{
      setLoading(false)
      return {
        success : false,
        message : error.message
      }
    })
    let status=success?"success":"error"
    toast({
      title: message,
      description: message,
      status: status
    })
  }


  function doUpscale(){
    setLoading(true)
    console.log(augmentation)
    fetch(`${upscaleEndpoint}/${params.uuid}`,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        uuid: data.uuid,
        augmentation : augmentation
      })
    })
    .then((response) => {
      return response.json();
    })
    .then((d) => {
      let updatedData = JSON.parse(JSON.stringify(data));
      updatedData.upscale_requested = true
      setData({ ...data, ...updatedData });
      setIsModified(true)
      return d;
    });
  }

  async function update() {
    setLoading(true)
    console.log(data)
    const { success, message } = await fetch(
      `${process.env.REACT_APP_api_url}/v3/create/update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          job: data 
        }),
      }
    )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setLoading(false);
      return data;
    })
    .catch(error=>{
      setLoading(false)
      return {
        success : false,
        message : error.message
      }
    })

    let status=success?"success":"error"
    toast({
      title: message,
      description: message,
      status: status
    })
  }
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Augment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            {augmentation && <>
              <FormControl>
                <FormLabel htmlFor="private">Face Enhance</FormLabel>
                <Switch
                  id="face_enhance"
                  isChecked={(augmentation.face_enhance===true)?true:false}
                  onChange={(event) => {
                    let updatedAugmentation = JSON.parse(JSON.stringify(augmentation));
                    updatedAugmentation.face_enhance = event.target.checked ? true : false;
                    setAugmentation({ ...augmentation, ...updatedAugmentation });
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="model_name">Model</FormLabel>
                <Select id = "model_name" placeholder='Select a model' value={augmentation.model_name} onChange={(event) => {
                  let updatedAugmentation = JSON.parse(JSON.stringify(augmentation));
                  let value = event.target.selectedOptions[0].value;
                  updatedAugmentation.model_name = value
                  setAugmentation({ ...augmentation, ...updatedAugmentation});
                }}>
                {
                [
                  {"key" : "RealESRGAN_x4plus", "text" : "RealESRGAN_x4plus"},
                  {"key" : "RealESRGAN_x4plus_anime_6B", "text" : "RealESRGAN_x4plus_anime_6B"},
                  {"key" : "RealESRGAN_x2plus", "text" : "RealESRGAN_x2plus"},
                  // {"key" : "realesr-general-x4v3.pth", "text" : "realesr-general-x4v3.pth"}
                  // {"key" : "realesr-animevideov3", "text" : "realesr-animevideov3"}
                ].map(shape=>{
                  return <option value={shape.key}>{shape.text}</option>
                })
                }
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="outscale">Scale</FormLabel>
                <NumberInput
                  id="outscale"
                  step={1}
                  value={augmentation.outscale}
                  min={1}
                  max={4}
                  clampValueOnBlur={true}
                  onChange={(value) => {
                    let updatedAugmentation = JSON.parse(JSON.stringify(augmentation));
                    updatedAugmentation.outscale = parseInt(value)
                    setAugmentation({ ...augmentation, ...updatedAugmentation});
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper/>
                    <NumberDecrementStepper/>
                  </NumberInputStepper>
                </NumberInput>
                </FormControl>
            </>}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>Cancel</Button>
              <Button colorScheme='green' mr={3} onClick={()=>{               
                doUpscale()
                onClose()
              }}>Augment</Button>
              {/* <Button variant='ghost'>Secondary Action</Button> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
      {error}
      {!error && <>
        {/* {data && (data.status==="archived" || data.status==="complete") &&
        <Image
            bg={`rgb(${data.dominant_color[0]}, ${data.dominant_color[1]},${data.dominant_color[2]},0.5)`}
            position={'absolute'}
            top={-10}
            left={-10}
            right={-10}
            bottom={-10}
            style={{
              filter: 'blur(70px)',
              zIndex: '-1',
              transformOrigin: "50% 50%",
              // transform: 'scale(2.0)',
              backgroundSize : "contain"
            }}
            objectFit="contain"
            src={`http://images.feverdreams.app/jpg/${data.uuid}.jpg`}
          />
        } */}
      <HStack mt={4} mb={4} maxW="1024" m="auto" position={'relative'}>
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
                      {/* {params.uuid} */}
                    </Heading>
                    {data && data.timestamp && (()=>{
                      return <Text fontSize={"xs"}>
                        {dt(data.timestamp)}
                      </Text>
                    })()}
                    <Flex alignItems="center">
                      <Heading as="h5" pr="2" size="xs">
                        {(data && data.userdets)?data.userdets.nickname?data.userdets.nickname:data.userdets.display_name:"Unknown User"}
                      </Heading>
                      <Button
                        colorScheme='blue'
                        variant='outline'
                        size="xs"
                        onClick={() => {
                          fetch(
                            `${process.env.REACT_APP_api_url}/follow/${data.str_author}`,
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
                  </WrapItem>
                  <WrapItem>
                    <Wrap>
                      <WrapItem>
                        <Button
                          // isRound
                          isLoading = {pinLoading}
                          colorScheme={'pink'}
                          size="md"
                          onClick={() => {
                            if(!isAuthenticated){
                              loginWithRedirect()
                            }else{
                              let method = "POST"
                              if(isPinned) {
                                method = "DELETE"
                              }else{
                                method = "POST"
                              }
                              setPinLoading(true)
                              fetch(
                                `${process.env.REACT_APP_api_url}/pin/${data.uuid}`,
                                {
                                  method: method,
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({ }),
                                }
                              ).then(r=>{
                                if(isPinned){
                                  setIsPinned(false)
                                  if(data.pinned) {
                                    setDelta(-1)
                                  }else{
                                    setDelta(0)
                                  }
                                }else{
                                  setIsPinned(true)
                                  if(!data.pinned) {
                                    setDelta(+1)
                                  }else{
                                    setDelta(0)
                                  }
                                }
                                setPinLoading(false)
                              })
                            }
                          }}
                          // ml={1}
                          leftIcon={(isPinned)?<AiFillHeart />:<AiOutlineHeart />}
                        >{(data && data.likes?data.likes:0)+delta}
                        </Button>
                      </WrapItem>
                      <WrapItem>
                        <IconButton
                          isRound
                          colorScheme={'purple'}
                          size="md"
                          onClick={event=>{
                            navigator.clipboard.writeText(shareURL)
                            toast({
                              title: "Share URL copied",
                              description: "A share link has been copied to your clipboard.",
                              status: "success"
                            })
                          }}
                          // ml={1}
                          // isDisabled
                          icon={<MdIosShare />}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="heroicons-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          {hasCopiedURL ? 'URL Copied' : 'Share'}
                        </IconButton>
                      </WrapItem>
                      {data && data.algo==="disco" &&
                        <WrapItem>
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
                        </WrapItem>
                      }
                      {data && ((user === data.str_author && data.private && data.algo==="stable") || data.algo==="disco" || (data.algo==="stable" && !data.private)) && 
                      <WrapItem>
                        <Button
                          colorScheme={'green'}
                          // size="xs"
                          onClick={() => (navigate(`${mutateEndpoint}/${params.uuid}`))}
                          ml={1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="heroicons-md" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                          </svg>
                          Mutate
                        </Button>
                      </WrapItem>
                      }
                      {data && (data.status === 'complete' || data.status === 'archived') &&
                      <WrapItem>
                        <Button
                          colorScheme={'green'}
                          // size="xs"
                          onClick={() => {
                                let url =""
                                if(data.algo==="disco") url = data.status === 'processing'
                                  ? `${IMAGE_HOST}/images/${params.uuid}_progress.png`
                                  : data.origin==='upload'
                                  ? `${IMAGE_HOST}/images/${params.uuid}.png`
                                  : `${IMAGE_HOST}/images/${params.uuid}0_0.png`
                                
                                if(data.algo==="alpha" || data.algo=="stable") url = (data.status === 'complete' || data.status === 'archived')
                                  ? `${IMAGE_HOST}/images/${params.uuid}.png`
                                  : `${IMAGE_HOST}/${data.status}.jpg`
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
                      }
                      {data && ((user === data.str_author && data.algo==="stable")) && 
                      <WrapItem>
                        <Button
                          colorScheme={'green'}
                          // size="xs"
                          onClick={()=>{
                            let newAugmentation = {
                              model_name : "RealESRGAN_x4plus",
                              face_enhance : false,
                              outscale : 2
                            }
                            setAugmentation({...augmentation, ...newAugmentation})
                            onOpen()
                          }}
                          ml={1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="heroicons-md" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                          </svg>
                          Augment
                        </Button>
                      </WrapItem>
                      }
                    </Wrap>
                  </WrapItem>
              </Wrap>
            </Flex>
          </Flex>
        </Skeleton>
      </HStack>
      {data && (data.status==="archived" || data.status==="complete") && 
        <Center>
        <Box w={1024}>
          <Tabs variant={"solid-rounded"} index={data.selectedTab} onChange={index=>{
            let updatedData = JSON.parse(JSON.stringify(data));
            updatedData.selectedTab = index
            setData({ ...data, ...updatedData });
          }}>
            <TabList>
              {data.images && data.images.map(image=>{
                return <Tab>{image.label}</Tab>
              })}
            </TabList>
            <TabPanels>
              {data.images && data.images.map(image=>{
                return <TabPanel>
                  {isAuthenticated && data.str_author === user && data.preferredImage != image.hash && <Button colorScheme={"green"} onClick={(event) => {
                    let updatedData = JSON.parse(JSON.stringify(data));
                    updatedData.preferredImage = image.hash
                    setData({ ...data, ...updatedData });
                    setIsModified(true)
                  }}>Make Preferred Image</Button>}
                  {image.params &&
                  <Wrap>
                    <WrapItem>
                      <Badge mr={3} variant={"outline"}>{image.params.model_name}</Badge>
                    </WrapItem>
                    <WrapItem>
                      <Badge mr={3} variant={"outline"}>Face Enhance: {image.params.face_enhance.toString()}</Badge>
                    </WrapItem>
                    <WrapItem>
                      <Badge mr={3} variant={"outline"}>Scale: {image.params.outscale}</Badge>
                    </WrapItem>
                  </Wrap>
                  }
                  <Link>
                    <Image
                      onClick={(() => {
                        let url = ""
                        url = `${IMAGE_HOST}/images/${image.hash}.png`
                        window.open(url, "_blank")
                      })}
                      maxH="1024"
                      m="auto"
                      mt="3"
                      mb="3"
                      borderRadius="lg"
                      alt={
                        (data.algo === "disco")?data.text_prompts?data.text_prompts:data.text_prompt:data.prompt
                      }
                      objectFit="cover"
                      src={`http://images.feverdreams.app/jpg/${image.hash}.jpg`
                      }
                    />
                  </Link>
                </TabPanel>
              })}
            </TabPanels>
          </Tabs>
        </Box>
        </Center>
      }
      
      {data && (data.status==="rejected" || data.status==="failed") && 
      <>
        <VStack>
          <Center>
            <Code my={3} p={4} borderRadius="md" maxW="1024">{data.traceback}</Code>
          </Center>
          {isAuthenticated && data.str_author === user &&
        <Center>
          {/* {(data && (data.status==="rejected" || data.status==="failed") || data.status==="queued") && <Button colorScheme={"blue"} onClick={() => {
            navigate(`${editEndpoint}/${data.uuid}`)
          }}>Edit</Button>} */}
        {(data && (data.status==="rejected" || data.status==="failed")) && <Button colorScheme={"blue"}  isDisabled={!(data.status==="rejected" || data.status==="failed")} onClick={() => {
        fetch(
            `${process.env.REACT_APP_api_url}/web/retry`,
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
              `${process.env.REACT_APP_api_url}/web/cancel`,
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
             { isAuthenticated && data.str_author === user && 
              <Center>
              {(data.status==="queued") && <>
                <Button colorScheme={"blue"} onClick={() => {
                  navigate(`/edit/${data.uuid}`)
                }}>Edit</Button>
              <Button colorScheme={"red"} isDisabled={!(data.status==="rejected" || data.status==="failed" || data.status==="queued")}  onClick={() => {
                fetch(
                    `${process.env.REACT_APP_api_url}/web/cancel`,
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
      <Skeleton isLoaded={!loading} className='w-100'>
      {data && <VStack> 
        {isAuthenticated && data.origin !=="dream" && data.algo==="stable" && (user === data.str_author) &&
          <SimpleGrid columns={{sm: 1, md: 3}} spacing="20px">
            <FormControl>
              <FormLabel htmlFor="private">Private Settings</FormLabel>
              <Switch
                id="private"
                isChecked={(data.private===true)?true:false}
                onChange={(event) => {
                  let updatedData = JSON.parse(JSON.stringify(data));
                  updatedData.private = event.target.checked ? true : false;
                  setData({ ...data, ...updatedData });
                  setIsModified(true)
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="nsfw">NSFW</FormLabel>
              <Switch
                id="nsfw"
                isChecked={(data.nsfw===true)?true:false}
                onChange={(event) => {
                  let updatedData = JSON.parse(JSON.stringify(data));
                  updatedData.nsfw = event.target.checked ? true : false;
                  setData({ ...data, ...updatedData });
                  setIsModified(true)
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="hide">Hide</FormLabel>
              <Switch
                id="hide"
                isChecked={(data.hide===true)?true:false}
                onChange={(event) => {
                  let updatedData = JSON.parse(JSON.stringify(data));
                  updatedData.hide = event.target.checked ? true : false;
                  setData({ ...data, ...updatedData });
                  setIsModified(true)
                }}
              />
            </FormControl>
          </SimpleGrid>}
        <Box>
          <Wrap>
            <Badge variant="outline">
              {data.algo?data.algo:"disco"}
            </Badge>
            <Badge variant="outline">
              {data.status}
            </Badge>
            {data && data.params && data.params.sampler && <Badge variant="outline">
              {data.params.sampler}
            </Badge>}
            {data && data.algo=="disco" && data.width_height && (()=>{
              return <Badge variant="outline" colorScheme="green">
                {data.width_height[0]}x{data.width_height[1]}
              </Badge>
            })()}
            {data && (data.algo=="alpha" || data.algo=="stable") && data.width_height && (()=>{
              return <Badge variant="outline">
                {data.width_height[0]}x{data.width_height[1]}
              </Badge>
            })()}
            {data && data.params && <>
            <Badge variant="outline">
              Seed: {seed}
            </Badge>
            <Badge variant="outline">
              Steps: {steps}
            </Badge>
            </>}
          </Wrap>
        </Box>
        {(!data.private || (user === data.str_author)) && 
        <>
          <Code className="copy-prompt-container" my={3} p={4} pb={12} borderRadius="md" maxW="1024">
            {textPrompt}
            <Button className="copy-prompt-btn" size="sm" colorScheme={'gray'} onClick={onCopy} ml={2}>
              {hasCopied ? 'Copied' : 'Copy Text Prompt'}
            </Button>
          </Code>
          <Box>
            <HStack>
              {data && data.algo=="disco" && data.results && (()=>{
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
            {/* <Link color={'green.400'} href={`${process.env.REACT_APP_api_url}/v2/job/${data.uuid}`}>Metadata</Link> */}
        </>}
        {data && <Link color={'red.400'} onClick={() =>{
          reportNSFW()
        } }>Report NSFW</Link>}
        <Box>
          <HStack>
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
        {related && related.length > 0 &&
        <Box w={"100%"} maxW={1024}>
          <Heading size={"md"}>Related</Heading>
          <FeedGrid dreams={related} loading={loading} isAuthenticated={isAuthenticated} token={token} user={user}/>
        </Box>
      }
      </VStack>}
      </Skeleton>
    </>}
    </>
  );
}

export default PiecePage;