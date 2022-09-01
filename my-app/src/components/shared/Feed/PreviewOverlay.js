import React from 'react';
import { Avatar, AvatarBadge, Box, Flex, Image, HStack, IconButton} from '@chakra-ui/react';
import { AiOutlineHeart, AiFillHeart, AiFillTags } from 'react-icons/ai';
import { BiHide, BiShow } from 'react-icons/bi';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams, useNavigate } from 'react-router-dom';
export function PreviewOverlay({piece, isInterested, isAuthenticated, token, user}) {
  const navigate = useNavigate()
  const { loginWithRedirect } = useAuth0()
  const [isPinned, setIsPinned] = useState(piece.pinned?true:false)
  const [isHidden, setIsHidden] = useState(piece.hide?true:false)
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
    transition: `visibility 0s ${duration}s, opacity ${duration}s linear, backdrop-filter ${duration}s;`,
    position : "absolute",
    top : 0,
    left : 0,
    right: 0,
    bottom: 0,
  }
  let authorStyle = {
    backgroundColor : "rgba(0,0,0,0.4)",
    width : "100%", height : "100%",
    padding : "5px",
    borderRadius : "5px",
    backdropFilter: "blur(10px)"
  }
  let overlayStyle, maskStyle
  if(isInterested) {
    overlayStyle = interestedStyle 
  }else{
    overlayStyle = uninterestedStyle 
  }
  if(isHidden) {
    maskStyle = {
      position : "absolute",
      top : 0,
      left : 0,
      right: 0,
      bottom: 0,
      backdropFilter : "blur(10px)",
      backgroundColor : "rgba(0,0,0,0.4)"
    }
  }else{
    maskStyle = {}
  }
  useEffect(() => {
    console.log(piece)
    console.log(user)
  }, [isPinned, isHidden]);

    return (
    <Box style={maskStyle}>
        <Box style={overlayStyle} onClick={()=>{navigate(`/piece/${piece.uuid}`)}}>
          <IconButton
            style={{
              position : "absolute",
              top : 0,
              left : 0,
              zIndex : 1
            }}
            isRound
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
                setIsPinned(!isPinned)
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
                )
              }
            }}
            icon={(isPinned)?<AiFillHeart />:<AiOutlineHeart />}
          />
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
                if(isHidden) {
                  method = "DELETE"
                }else{
                  method = "POST"
                }
                setIsHidden(!isHidden)
                fetch(
                  `${process.env.REACT_APP_api_url}/hide/${piece.uuid}`,
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
            icon={(isHidden)?<BiHide />:<BiShow />}
          />
          }
          <Box pos="absolute" bottom="0" m={5} p={2} >
            <div style={authorStyle}>
            <Link to={`/gallery/${piece.userdets.user_str}/1`}>
              <HStack><Avatar size='sm' name={piece.userdets.display_name?piece.userdets.display_name:piece.userdets.nickname} src={piece.userdets.picture?piece.userdets.picture:piece.userdets.avatar}>
                {/* <AvatarBadge boxSize='1.25em' bg='green.500' /> */}
                </Avatar><small> {piece.userdets.nickname?piece.userdets.nickname:piece.userdets.display_name} </small>
              </HStack>
            </Link>
            </div>
            {piece.params && piece.params.prompt && 
            <div style={authorStyle}>
                <small> {piece.params.prompt}</small>
            </div>
            }
            {/* <small> Time: { timestamp } </small> */}
          </Box>
        </Box>
    </Box>
  );
}