import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center, Avatar, Skeleton, Heading, HStack, VStack, Button, VisuallyHidden, useColorModeValue} from '@chakra-ui/react';
import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

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

  const SocialButton = ({children,label,href}) => {
    return (
      <Button
        bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
        rounded={'full'}
        // w={24}
        // h={12}
        cursor={'pointer'}
        as={'a'}
        href={href}
        target={'_blank'}
        display={'inline-flex'}
        alignItems={'center'}
        justifyContent={'left'}
        transition={'background 0.3s ease'}
        _hover={{
          bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
        }}>
          {children}&nbsp;{label}
      </Button>
    );
  };

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
              {data && data.userdetails && <Button
                colorScheme='blue'
                variant='outline'
                size="xs"
                onClick={() => {
                  fetch(
                    `https://api.feverdreams.app/follow/${data.userdetails.user_id_str}`,
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
              </Button>}
              {(data && data.userdetails && data.userdetails.social && data.userdetails.social.twitter) &&
                <SocialButton label={data.userdetails.social.twitter} href={`https://twitter.com/${data.userdetails.social.twitter}`}>
                  <FaTwitter />
                </SocialButton>
              }
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
