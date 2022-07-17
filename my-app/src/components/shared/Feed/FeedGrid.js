import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Skeleton, Center, Box } from '@chakra-ui/react';
import { Preview } from './Preview';

/*
type Dreams = {
  uuid: string ,
  thumbnails: ?Array<Number>
}

type Loading = boolean;
*/
const FeedGrid = ({ dreams, loading }) => {
  console.log('dreams', dreams);

  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 300: 1, 480: 2, 560: 3, 821: 4, 992: 4 }}
    >
      <Masonry gutter="16x">
        {loading &&
          [...Array(50)].map((i) => (
            <Skeleton
              margin=".25em"
              borderRadius="lg"
              minHeight="100px"
              key={i}
            />
          ))}
        {!loading &&
          dreams.map(({ uuid, thumbnails }) => (
            <Skeleton
              margin=".25em"
              borderRadius="lg"
              minHeight="50px"
              min-width="360px"
              isLoaded={!loading}
            >
              <Center>
                <Preview thumbnails={thumbnails} key={uuid} uuid={uuid} />
              </Center>
            </Skeleton>
          ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default FeedGrid;
