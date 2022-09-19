import React from 'react';
import { Avatar, AvatarBadge, Box, Flex, Image, HStack, IconButton, Button, Badge} from '@chakra-ui/react';
import { AiOutlineDelete, AiOutlineSave } from 'react-icons/ai';
import { BiHide, BiShow } from 'react-icons/bi';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams, useNavigate } from 'react-router-dom';
export function ReviewOverlay({piece, isInterested, isAuthenticated, token, user, onDecided}) {
  const navigate = useNavigate()
  const { loginWithRedirect } = useAuth0()
  const [isLoading, setIsLoading] = useState(false)
  const [decided, setDecided] = useState(false)
  let duration = 0.2
  let interestedStyle = {
    cursor: "pointer",
    visibility: "visible",
    opacity: 1,
    transition: `opacity ${duration}s linear`,
    position : "absolute",
    top : 0,
    left : 0,
    right: 0,
    bottom: 0,
  }
  let uninterestedStyle = {
    visibility: "hidden",
    opacity: 0.4,
    transition: `visibility 0s ${duration}s, opacity ${duration}s linear, backdrop-filter ${duration}s`,
    position : "absolute",
    top : 0,
    left : 0,
    right: 0,
    bottom: 0,
  }
  let maskStyle = {
    position : "absolute",
    top : 0,
    left : 0,
    right: 0,
    bottom: 0,
    backdropFilter : "blur(10px)",
    backgroundColor : "rgba(0,0,0,0.4)"
  }
  useEffect(() => {
  }, []);

    return (
    <Box style={decided?maskStyle:{}}>
        <Box style={(isInterested && !decided)?interestedStyle:uninterestedStyle} onClick={()=>{
          // Show modal
        }}>
          <IconButton
            style={{
              position : "absolute",
              top : 0,
              left : 0,
              zIndex : 2
            }}
            isRound
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
          <IconButton
            style={{
              position : "absolute",
              top : 0,
              right : 0,
              zIndex : 2
            }}
            isRound
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
            icon={<AiOutlineDelete />}
          />
          <Box pos="absolute" bottom="0" m={5} p={2} >
            <Badge colorScheme={"blue"} variant={"solid"} mr={2}>
              {piece.params.seed}
            </Badge>
            <Badge colorScheme={"blue"} variant={"solid"}>
              {piece.params.sampler}
            </Badge>
            <div style={(()=>{
              let bgColor = "rgba(0,0,0,0.4)"
              let authorStyle = {
                backgroundColor : bgColor,
                width : "100%", height : "100%",
                padding : "5px",
                borderRadius : "10px",
                backdropFilter: "blur(10px)",
                boxShadow: "0px 0px 10px 10px rgba(0,0,0,0.4)"
              }
              return authorStyle
            })()}>
            <HStack>
              <Box onClick={(e)=>{
                navigate(`/gallery/${piece.userdets.user_str}/1`)
                console.log(`/gallery/${piece.userdets.user_str}/1`)
                e.stopPropagation()
              }}>
              </Box>
            </HStack>
            {piece.params && piece.params.prompt && 
                <small style={{color:"#FFF", textShadow: "1px 1px 2px #2a2a2a"}}> {piece.params.prompt}</small>
            }</div>
            {/* <small> Time: { timestamp } </small> */}
          </Box>
        </Box>
    </Box>
  );
}