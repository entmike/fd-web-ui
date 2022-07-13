import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center, Avatar, Skeleton, Heading, HStack, VStack, Button} from '@chakra-ui/react';
import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';

export default function UserGalleryPage({token, isAuthenticated}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();


  useEffect(() => {
    setLoading(true);
    let userdetails = fetch(`https://api.feverdreams.app/user/${params.user_id}`)
      .then((response) => response.json())
      .then((actualData) => {
        return actualData
    })
  
    let feed = fetch(`https://api.feverdreams.app/userfeed/${params.user_id}/50/${params.page}`)
      .then((response) => response.json())
      .then((actualData) => {
        return actualData;
    })

    Promise.all([userdetails, feed]).then((data) => {
      console.log(data);
      setError(null);
      setData({
        userdetails : data[0],
        feed : data[1]
      });
      setLoading(false);
    });

  }, [params.user_id, params.page, token, isAuthenticated]);

    

  const prevURL = `/gallery/${params.user_id}/${parseInt(params.page) - 1}`;
  const nextURL = `/gallery/${params.user_id}/${parseInt(params.page) + 1}`;

  return (
    <>
      <HStack>
        <Skeleton isLoaded={!loading}>
          {data && data.userdetails && <Avatar size="xl" src={(data && data.userdetails)?data.userdetails.avatar:"/avatar-placeholder.png"}></Avatar>}
        </Skeleton>
        <Skeleton isLoaded={!loading}>
          <VStack alignItems={"left"}>
            <Heading>{(data && data.userdetails)?data.userdetails.user_name:"Loading"}'s Gallery</Heading>
            <HStack>
              <Button
                colorScheme='blue'
                variant='outline'
                size="xs"
                onClick={() => {
                  fetch(
                    `https://api.feverdreams.app/follow/${data.userdetails.user_id}`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                }}
              >
                Follow
              </Button>
            </HStack>
          </VStack>
        </Skeleton>
      </HStack>
      <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      />
      {data && data.feed && <FeedGrid dreams={data.feed} loading={loading} />}
      <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      />
    </>
  );
}
