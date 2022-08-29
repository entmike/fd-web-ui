import React from 'react';
import { Box, Image, HStack, Button, IconButton } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Previewcaption } from './Previewcaption';
import { useState, useEffect } from 'react';

export function Preview({piece, isAuthenticated, token, user}) {
  const [isInterested, setIsInterested] = useState(false);
  function touchover(){
    setIsInterested(true)
    window.setTimeout(()=>{
      setIsInterested(false)
    }, 2000)
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
      <Link to={`/piece/${piece.uuid}`}>
        <Image
          src={`http://images.feverdreams.app/thumbs/1024/${piece.uuid}.jpg`}
          alt={piece.uuid}
          transition="0.2s ease-in-out"
          // objectFit="contain"
          style={{ objectFit: 'cover' }}
          _hover={{ transform: 'scale(1.1)' }}
        />
      </Link>
      <Previewcaption piece={piece} isInterested={isInterested} isAuthenticated={isAuthenticated} token={token} user = {user}/>
    </Box>
  );
}
