import React from 'react';
import { Avatar, AvatarBadge, Box, Flex, Image, HStack, IconButton} from '@chakra-ui/react';
import { AiOutlineHeart, AiFillHeart, AiFillTags } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiBorderRadius } from 'react-icons/bi';
import { useAuth0 } from '@auth0/auth0-react';

export function Previewcaption({piece, isInterested, isAuthenticated, token, user}) {
  const { loginWithRedirect } = useAuth0();
  const [isPinned, setIsPinned] = useState(piece.pinned?true:false);
  let duration = 0.2
  let interestedBtnStyle = {
    position : "absolute",
    top : 0,
    left : 0,
    zIndex : 1,
    visibility: "visible",
    opacity: 1,
    transition: `opacity ${duration}s linear`
  }
  let interestedAuthorStyle = {
    backgroundColor : "rgba(0,0,0,0.4)",
    width : "100%", height : "100%",
    padding : "5px",
    borderRadius : "5px",
    backdropFilter: "blur(10px)",
    visibility: "visible",
    opacity: 1,
    transition: `opacity ${duration}s linear`
  }
  let uninterestedBtnStyle = {
    position : "absolute",
    top : 0,
    left : 0,
    zIndex : 1,
    visibility: "hidden",
    opacity: 0,
    transition: `visibility 0s ${duration}s, opacity ${duration}s linear`
  }
  let uninterestedAuthorStyle = {
    backgroundColor : "rgba(0,0,0,0.4)",
    width : "100%", height : "100%",
    padding : "5px",
    borderRadius : "5px",
    visibility: "hidden",
    opacity: 0,
    transition: `visibility 0s ${duration}s, opacity ${duration}s linear`
  }
  let btnStyle, authorStyle
  if(isInterested) {
    btnStyle = interestedBtnStyle 
    authorStyle = interestedAuthorStyle
  }else{
    btnStyle = uninterestedBtnStyle
    authorStyle = uninterestedAuthorStyle
  }
  useEffect(() => {
    // console.log(isPinned)
  }, [isPinned]);

    return (<>
      <IconButton
        style={btnStyle}
        isRound
        colorScheme={'pink'}
        size="md"
        onClick={() => {
          if(!isAuthenticated){
            loginWithRedirect()
          }else{
            let method = "POST"
            if(piece.pinned) {
              method = "DELETE"
            }else{
              method = "POST"
            }
            setIsPinned(!isPinned)
            fetch(
              `https://api.feverdreams.app/pin/${piece.uuid}`,
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
      <Box pos="absolute" bottom="0" m={5} p={2} >
        <div style={authorStyle}>
        <Link to={`/gallery/${piece.userdets.user_str}/1`}>
          <HStack><Avatar size='sm' name={piece.userdets.display_name?piece.userdets.display_name:piece.userdets.nickname} src={piece.userdets.picture?piece.userdets.picture:piece.userdets.avatar}>
            {/* <AvatarBadge boxSize='1.25em' bg='green.500' /> */}
            </Avatar><small> {piece.userdets.nickname?piece.userdets.nickname:piece.userdets.display_name} </small>
          </HStack>
        </Link>
        </div>
        {/* <small> Time: { timestamp } </small> */}
      </Box>
      </>
  );
}
