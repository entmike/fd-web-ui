import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Skeleton, Center } from '@chakra-ui/react';
import { Preview } from './Preview';

const FeedGrid = ({ dreams, loading }) => (
  <ResponsiveMasonry
    columnsCountBreakPoints={{ 300: 1, 480: 2, 560: 3, 821: 4, 992: 4 }}
  >
    <Masonry gutter="16x">
      {dreams?.map(
        ({
          uuid,
          author,
          text_prompt,
          render_type,
          duration,
          userdets,
          timestamp,
          dominant_color,
          thumbnails,
        }) => (
          <Skeleton
            key={uuid}
            margin=".25em"
            borderRadius="lg"
            minHeight="50px"
            min-width="360px"
            isLoaded={!loading}
          >
            <Center>
              <Preview
                width="460x"
                thumbnails={thumbnails}
                dominant_color={dominant_color ? dominant_color : [0, 0, 0]}
                userdets={userdets}
                timestamp={timestamp}
                key={uuid}
                uuid={uuid}
                text_prompt={text_prompt}
                render_type={render_type}
                duration={duration}
              />
            </Center>
          </Skeleton>
        )
      )}
    </Masonry>
  </ResponsiveMasonry>
);

export default FeedGrid;
