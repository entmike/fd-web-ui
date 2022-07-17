import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Skeleton,
  Heading,
  HStack,
  VStack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';
import { FaTwitter } from 'react-icons/fa';

export default function UserGalleryPage({ token }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userIsLoading, setUserIsLoading] = useState(false);

  const params = useParams();

  useEffect(() => {
    if (!userDetails) {
      setUserIsLoading(true);
      fetch(`https://api.feverdreams.app/user/${params.user_id}`)
        .then((response) => response.json())
        .then((actualData) => {
          setUserIsLoading(false);
          setUserDetails(actualData);
        });
    }
  });

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.feverdreams.app/userfeed/${params.user_id}/50/${params.page}`
    )
      .then((response) => response.json())
      .then((actualData) => {
        setError(null);
        setData({
          feed: actualData,
        });
        setLoading(false);
      });
  }, [params.user_id, params.page]);

  const prevURL = `/gallery/${params.user_id}/${parseInt(params.page) - 1}`;
  const nextURL = `/gallery/${params.user_id}/${parseInt(params.page) + 1}`;

  const SocialButton = ({ children, label, href }) => (
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
      }}
    >
      {children}&nbsp;{label}
    </Button>
  );

  const handleFollowClick = () => {
    fetch(`https://api.feverdreams.app/follow/${userDetails.user_id_str}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const userAvatar = userDetails
    ? userDetails.avatar
    : '/avatar-placeholder.png';
  const userNameGallery = userDetails ? userDetails.user_name : 'Loading';

  return (
    <>
      <HStack>
        <Skeleton isLoaded={!userIsLoading}>
          {userDetails && <Avatar size="xl" src={userAvatar} />}
        </Skeleton>
        <Skeleton isLoaded={!userIsLoading}>
          <VStack alignItems={'left'}>
            <Heading>{`${userNameGallery}'s Gallery`}</Heading>
            <HStack>
              {userDetails && (
                <Button
                  colorScheme="blue"
                  variant="outline"
                  size="xs"
                  onClick={handleFollowClick}
                >
                  Follow
                </Button>
              )}
              {userDetails && userDetails.social && userDetails.social.twitter && (
                <SocialButton
                  label={userDetails.social.twitter}
                  href={`https://twitter.com/${userDetails.social.twitter}`}
                >
                  <FaTwitter />
                </SocialButton>
              )}
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
