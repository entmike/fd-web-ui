import React from 'react';
import { StablePiece } from "../StablePiece"
import { DiscoPiece } from "../DiscoPiece"
import {
  SimpleGrid,
} from '@chakra-ui/react';

const FeedList = (props) => {
  let {pieces, isAuthenticated, user, token, onDelete, onChange} = props
  return (
    <SimpleGrid columns={{sm: 1, md: 1, lg: 2}} spacing={10}>{pieces && pieces.map((piece, index)=>{
      if(piece.algo==="stable"){
        return <StablePiece key={piece.uuid} piece = {piece} isAuthenticated={isAuthenticated} user={user} token={token} 
        onDecided={()=>{
          if (onDelete) onDelete(index)
        }}
        onChange={(review)=>{
          if (onChange) onChange(review, index)
        }}
        />
      }

      if(piece.algo==="disco"){
        return <DiscoPiece key={piece.uuid} piece = {piece} isAuthenticated={isAuthenticated} user={user} token={token} 
        onDecided={()=>{
          if (onDelete) onDelete(index)
        }}
        onChange={(review)=>{
          if (onChange) onChange(review, index)
        }}
        />
      }

    })}      
    </SimpleGrid>
  );
};

export default FeedList;