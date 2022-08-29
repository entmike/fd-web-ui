import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Skeleton,
  Heading,
  HStack,
  VStack,
  Button
} from '@chakra-ui/react';
import FeedGrid from '../shared/Feed/FeedGrid';
import { SocialButton } from 'components/shared/SocialButton';
import PaginationNav from '../shared/Feed/PaginationNav';
import { FaTwitter } from 'react-icons/fa';

export default function UserGalleryPage({ isAuthenticated, token, user }) {
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
    let headers
    if (token) {
      headers = {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
      }
    }else{
      console.log("Not logged in")
    }
    fetch(
      `https://api.feverdreams.app/v3/userfeed/${params.user_id}/50/${params.page}`, {headers}
    )
      .then((response) => response.json())
      .then((actualData) => {
        setError(null);
        setLoading(false);
        setData({
          feed: actualData,
        });
      });
  }, [params.user_id, params.page, token, user, isAuthenticated]);

  const prevURL = `/gallery/${params.user_id}/${parseInt(params.page) - 1}`;
  const nextURL = `/gallery/${params.user_id}/${parseInt(params.page) + 1}`;

  const handleFollowClick = () => {
    fetch(`https://api.feverdreams.app/follow/${userDetails.user_id_str}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };

  let userAvatar = '/avatar-placeholder.png';
  let userNameGallery = "Loading..."
  if(userDetails){
    userAvatar = userDetails.picture?userDetails.picture:userDetails.avatar
    userNameGallery = userDetails.nickname?userDetails.nickname:userDetails.user_name
  }

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
      <FeedGrid dreams={data&&data.feed?data.feed:null} loading={loading} isAuthenticated={isAuthenticated} token={token} user = {user}/>
      <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      />
    </>
  );
}
