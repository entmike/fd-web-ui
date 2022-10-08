import React from 'react';
import { Avatar, AvatarBadge, Box, Flex, Image, HStack, IconButton, Button, Badge} from '@chakra-ui/react';
import { AiOutlineHeart, AiFillHeart, AiFillTags } from 'react-icons/ai';
import { FaTrash, FaTrashRestore } from 'react-icons/fa';
import { BiLinkExternal } from 'react-icons/bi';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate} from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
export function PreviewOverlay({piece, isInterested, isAuthenticated, token, user}) {
  const navigate = useNavigate()
  const { loginWithRedirect } = useAuth0()
  const [isPinned, setIsPinned] = useState((piece.pinned)?true:false)
  const [pinLoading, setIsPinLoading] = useState(false)
  const [delta, setDelta] = useState(0)
  const [isDeleted, setIsDeleted] = useState(piece.deleted?true:false)
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
  let overlayStyle, maskStyle
  if(isInterested) {
    overlayStyle = interestedStyle 
  }else{
    overlayStyle = uninterestedStyle 
  }
  if(isDeleted && !isInterested) {
    maskStyle = {
      position : "absolute",
      top : 0,
      left : 0,
      right: 0,
      bottom: 0,
      border: '5px solid rgba(200, 0, 0, 0.8)'
      // backdropFilter : "blur(10px)",
      // backgroundColor : "rgba(0,0,0,0.8)"
    }
  }else{
    maskStyle = {}
  }
  useEffect(() => {
    setIsPinned((piece.pinned)?true:false)
    setIsDeleted((piece.deleted)?true:false)
  }, [piece]);
  useEffect(() => {

  }, [isPinned, isDeleted, user, isAuthenticated, token]);

    return (
    <Box style={maskStyle}>
        <Box style={overlayStyle} onClick={()=>{
            navigate(`/piece/${piece.uuid}`)
          }}>
          <Box style={{
              position : "absolute",
              top : 0,
              left : 0,
              zIndex : 1,
              opacity: 0.7,
              // color : "#FFF"
            }}
          >
          <Button
            // isRound
            isLoading = {pinLoading}
            colorScheme={'pink'}
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              if(!isAuthenticated){
                loginWithRedirect()
              }else{
                let method = "POST"
                if(isPinned) {
                  method = "DELETE"
                }else{
                  method = "POST"
                }
                setIsPinLoading(true)
                fetch(
                  `${process.env.REACT_APP_api_url}/pin/${piece.uuid}`,
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
                    if(piece.pinned) {
                      setDelta(-1)
                    }else{
                      setDelta(0)
                    }
                  }else{
                    setIsPinned(true)
                    if(!piece.pinned) {
                      setDelta(+1)
                    }else{
                      setDelta(0)
                    }
                  }
                  setIsPinLoading(false)
                })
              }
            }}
            leftIcon={(isPinned)?<AiFillHeart />:<AiOutlineHeart />}
          >{(piece && piece.likes?piece.likes:0)+delta}</Button>
          <IconButton
            // isRound
            colorScheme={'blue'}
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/piece/${piece.uuid}`, '_blank')
            }}
            icon={<BiLinkExternal/>}
          />
        </Box>










          {piece.userdets.user_str === user && 
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
                let method = "POST"
                let url = `${process.env.REACT_APP_api_url}/delete/${piece.uuid}`
                if(isDeleted) {
                  url = `${process.env.REACT_APP_api_url}/undelete/${piece.uuid}`
                }
                setIsDeleted(!isDeleted)
                fetch(
                  url,
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
            icon={(isDeleted)?<FaTrashRestore />:<FaTrash />}
          />
          }
          <Box pos="absolute" bottom="0" m={5} p={2} >
            <div style={(()=>{
              let bgColor = "rgba(0,0,0,0.4)"
              if(piece.userdets.user_str === user){
                if(piece.private){
                  bgColor = "rgba(200,0,0,0.4)"
                }else{
                  bgColor = "rgba(0,170,50,0.4)"
                }
                
              }
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
              <Avatar size='sm' name={piece.userdets.display_name?piece.userdets.display_name:piece.userdets.nickname} src={piece.userdets.picture?piece.userdets.picture:piece.userdets.avatar}>
              </Avatar><strong><small style={{color:"#FFF", textShadow: "1px 1px 2px #2a2a2a"}}> {piece.userdets.nickname?piece.userdets.nickname:piece.userdets.display_name} </small></strong>
              </Box>
            </HStack>
            {piece.params && piece.params.prompt && 
                <>
                  <small style={{color:"#FFF", textShadow: "1px 1px 2px #2a2a2a"}}> {piece.params.prompt}</small><br />
                  <Badge>{piece.params.seed}</Badge>
                </>
            }</div>
            {/* <small> Time: { timestamp } </small> */}
          </Box>
        </Box>
    </Box>
  );
}