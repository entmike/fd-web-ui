import { MutatePopover } from "./MutatePopover"
import { PieceTags } from "./PieceTags"
import { PieceAuthor } from "./PieceAuthor"
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import {
    Box,
    Heading,
    Link,
    Image,
    IconButton,
    Text,
    Flex,
    Wrap,
    WrapItem,
    useColorModeValue,
    Code,
    Button,
    useToast,
    Switch,
    FormControl,
    FormLabel,
  } from '@chakra-ui/react';
  import { AiOutlineDelete, AiOutlineSave } from 'react-icons/ai';
  import { BsDice3 } from 'react-icons/bs';
  
export const DiscoPiece = (props) =>{
    let {piece, isAuthenticated, user, token, onDecided, onChange} = props
    const toast = useToast()
    const { loginWithRedirect } = useAuth0()
    const [isLoading, setIsLoading] = useState(false)
    const [decided, setDecided] = useState(false)
    const [diceRolling, setDiceRolling] = useState(false)
    function fireOnChange(updatedReview){
      if(onChange) onChange(updatedReview)
        setIsLoading(true)  
        fetch(
          `${process.env.REACT_APP_api_url}/v3/review/update`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({review : updatedReview}),
          }
        ).then((response=>{
          setIsLoading(false)
        })).catch(err=>{
          setIsLoading(false)
        })
    }
    return (<Box maxW={'7xl'} p="5" rounded={"lg"} borderWidth={1}>
        <Heading size={"sm"}>
          <Link textDecoration="none" _hover={{ textDecoration: 'none' }} style={{overflowWrap:"anywhere"}}>
            {piece.uuid}
          </Link>
        </Heading>
        <Box
          marginTop={{ base: '1', sm: '5' }}
          display="flex"
          flexDirection={{ base: 'column', sm: 'row' }}
          justifyContent="space-between">
          <Box
            display="flex"
            flex="1"
            marginRight="3"
            position="relative"
            alignItems="center">
            <Box
              width={{ base: '100%', sm: '85%' }}
              zIndex="2"
              marginLeft={{ base: '0', sm: '5%' }}
              marginTop="5%">
              <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
                <Image
                  borderRadius="lg"
                  src={`http://images.feverdreams.app/thumbs/512/${piece.preferredImage || piece.uuid}.jpg`}
                  alt={piece.uuid}
                  objectFit="contain"
                />
              </Link>
            </Box>
            <Box zIndex="1" width="100%" position="absolute" height="100%">
              <Box
                // bgGradient={useColorModeValue(
                //   'radial(orange.600 1px, transparent 1px)',
                //   'radial(orange.300 1px, transparent 1px)'
                // )}
                backgroundSize="20px 20px"
                opacity="0.4"
                height="100%"
              />
            </Box>
          </Box>
          <Box
            display="flex"
            flex="1"
            flexDirection="column"
            // justifyContent="center"
            marginTop={{ base: '3', sm: '0' }}>
            <Flex mb={5} style={{justifyContent: "space-between"}}>
              <IconButton
                // style={{
                //   position : "absolute",
                //   top : 0,
                //   left : 0,
                //   zIndex : 2
                // }}
                isRound
                isDisabled={isLoading}
                colorScheme={'green'}
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  if(!isAuthenticated){
                    loginWithRedirect()
                  }else{
                    let method = "POST"
                    setDecided(true)
                    if(onDecided) onDecided()
                    fetch(
                      `${process.env.REACT_APP_api_url}/review/${piece.uuid}`,{
                        method: method,
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ }),
                      })
                  }
                }}
                icon={<AiOutlineSave />}
              />
            {/* <Button
              isLoading={diceRolling}
              rounded={"full"}
              isDisabled={isLoading}
              colorScheme={'blue'}
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                if(!isAuthenticated){
                  loginWithRedirect()
                }else{
                  let method = "POST"
                  setDiceRolling(true)
                  fetch(
                    `${process.env.REACT_APP_api_url}/v3/rolldice`,
                    {
                      method: method,
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ uuid: piece.uuid, amount : 5 }),
                    }
                  ).then((response=>{
                    setDiceRolling(false)
                    toast({
                      title: "Job Received",
                      description: "5 more coming up",
                    })
                  })).catch(err=>{
                    setDiceRolling(false)
                  })
                }
              }}>
              <BsDice3 />&nbsp;x5</Button> */}
              {/* <MutatePopover piece = {piece} token = {token}/> */}
              <IconButton
              // style={{
              //   position : "absolute",
              //   top : 0,
              //   right : 0,
              //   zIndex : 2
              // }}
              isRound
              isDisabled={isLoading}
              colorScheme={'red'}
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                if(!isAuthenticated){
                  loginWithRedirect()
                }else{
                  let method = "DELETE"
                  setDecided(true)
                  if(onDecided) onDecided()
                  fetch(
                    `${process.env.REACT_APP_api_url}/review/${piece.uuid}`,
                    {
                      method: method,
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ }),
                    }
                  )
                }
              }}
              icon={<AiOutlineDelete />}/>
            </Flex>
            <Wrap>
              {/* <WrapItem>
              <FormControl>
                <FormLabel htmlFor="private">Private</FormLabel>
                <Switch
                  id="private"
                  isChecked = {piece.private}
                  isDisabled = {isLoading}
                  onChange={(event) => {
                    let updatedPiece = JSON.parse(JSON.stringify(piece))
                    updatedPiece.private = event.target.checked ? true : false
                    fireOnChange(updatedPiece)
                  }}
                />
              </FormControl>
              </WrapItem> */}
              <WrapItem>
              <FormControl>
                <FormLabel htmlFor="nsfw">NSFW</FormLabel>
                <Switch
                  id="nsfw"
                  isChecked = {(piece.nsfw===true)?true:false}
                  onChange={(event) => {
                    let updatedPiece = JSON.parse(JSON.stringify(piece))
                    updatedPiece.nsfw = event.target.checked?true:false
                    fireOnChange(updatedPiece)
                  }}
                />
              </FormControl>
              </WrapItem>
            </Wrap>
            {/* <PieceTags tags={[piece.params.sampler, `Seed: ${piece.params.seed}`, `Scale: ${piece.params.scale}`, `Steps: ${piece.params.steps}`]} /> */}
            <Text
              as="p"
              marginTop="2"
              color={useColorModeValue('gray.700', 'gray.200')}
              fontSize="md">
              <Code p={3}>{piece.discoart_tags.text_prompts}</Code>
            </Text>
            {piece.userdets && <PieceAuthor name="John Doe" date={new Date('2021-04-06T19:01:27Z')} />}
          </Box>
        </Box>     
      </Box>)
  }
  