import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Skeleton, Center, Box } from '@chakra-ui/react';
import { Preview } from './Preview';
import { useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';

const FeedGrid = ({ dreams, loading, isAuthenticated, token, user, mode, onDelete }) => {
  const { pathname } = useLocation();
  if(!mode) mode = "preview"
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    
  }, [token,user,isAuthenticated]);
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 300: 1, 480: 2, 560: 3, 821: 4, 992: 4 }}
    >
      <Masonry gutter="16x">
        {loading &&
          [...Array(50)].map((i, index) => (<Skeleton
              margin=".25em"
              borderRadius="lg"
              minHeight="100px"
              key={index}
            />)
          )}
        {!loading && dreams && dreams.map((piece, index) => (
            <Skeleton
              margin=".25em"
              borderRadius="lg"
              minHeight="50px"
              min-width="360px"
              isLoaded={!loading}
              key={piece.uuid}
            >
              <Center>
                <Preview mode={mode} piece={piece} key={piece.uuid} isAuthenticated={isAuthenticated} token={token} user = {user} onDecided={()=>{
                  if (onDelete) onDelete(index)
                }}/>
              </Center>
            </Skeleton>
          ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default FeedGrid;
