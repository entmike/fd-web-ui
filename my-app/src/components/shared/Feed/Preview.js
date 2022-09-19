import React from 'react';
import { Box, Image, HStack, Button, IconButton } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PreviewOverlay } from './PreviewOverlay';
import { ReviewOverlay } from './ReviewOverlay';
import { useState, useEffect } from 'react';

export function Preview({piece, isAuthenticated, token, user, mode, onDecided}) {
  const [isInterested, setIsInterested] = useState(false);
  if(!mode) mode = "preview"
  function touchover(){
    setIsInterested(true)
    window.setTimeout(()=>{
      setIsInterested(false)
    }, 4000)
  }
  function over(){
    setIsInterested(true)
  }
  function out(){
    setIsInterested(false)
  }
 
  return (
    <Box pos="relative" borderRadius="lg" overflow="hidden"
      onTouchStart={touchover}
      onMouseOver={over}
      onMouseOut={out}>
      <Image
        src={`http://images.feverdreams.app/thumbs/512/${piece.preferredImage || piece.uuid}.jpg`}
        alt={piece.uuid}
        transition="0.2s ease-in-out"
        // objectFit="contain"
        style={{ objectFit: 'cover' }}
        _hover={{ transform: 'scale(1.1)' }}
      />
      {mode==="preview" && <PreviewOverlay piece={piece} isInterested={isInterested} isAuthenticated={isAuthenticated} token={token} user = {user}/>}
      {mode==="review" && <ReviewOverlay piece={piece} isInterested={isInterested} isAuthenticated={isAuthenticated} token={token} user = {user} onDecided={e=>{
        if(onDecided) onDecided()
      }}/>}
    </Box>
  );
}
