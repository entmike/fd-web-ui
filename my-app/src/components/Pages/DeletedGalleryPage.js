import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, createSearchParams, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Skeleton,
  Heading,
  HStack,
  VStack,
  Button,
  Switch,
  FormControl,
  FormLabel,
  Text
} from '@chakra-ui/react';
import FeedGrid from '../shared/Feed/FeedGrid';
import { SocialButton } from 'components/shared/SocialButton';
import PaginationNav from '../shared/Feed/PaginationNav';
import { FaTwitter } from 'react-icons/fa';

export default function DeletedGalleryPage({ isAuthenticated, token, user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [include, setInclude] = useState(searchParams.getAll("include"));
  const [exclude, setExclude] = useState(searchParams.getAll("exclude"));
  const [userDetails, setUserDetails] = useState(null);
  const [userIsLoading, setUserIsLoading] = useState(false);

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userDetails) {
      setUserIsLoading(true);
      fetch(`${process.env.REACT_APP_api_url}/user/${params.user_id}`)
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
      // console.log("Not logged in")
    }
    let url = `${process.env.REACT_APP_api_url}/v3/deletedfeed/${params.user_id}/50/${params.page}?q=1`
    if(exclude.length>0){
      url += `&exclude=${exclude.join(',')}`
    }
    if(include.length>0){
      url += `&include=${include.join(',')}`
    }
    if(user){
      // console.log(url)
      fetch(
      url, {headers}
      )
      .then((response) => response.json())
      .then((actualData) => {
        setError(null);
        setLoading(false);
        setData({
          feed: actualData,
        });
      });
    }
  }, [params.user_id, params.page, token, user, isAuthenticated, include, exclude]);

  const prevURL = `/deleted/${params.user_id}/${parseInt(params.page) - 1}`;
  const nextURL = `/deleted/${params.user_id}/${parseInt(params.page) + 1}`;

  const handleFollowClick = () => {
    fetch(`${process.env.REACT_APP_api_url}/follow/${userDetails.user_id_str}`, {
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
            <Heading>{`${userNameGallery}'s Trash Can 💩🪰`}</Heading>
            <Text>Accidentally delete something? &nbsp;Changed your mind? &nbsp;Just want to browse your terrible art fails in the privacy of your own garbage pile? &nbsp;Welcome to your trash can! &nbsp;Trash is emptied on a completely unpredictable and infrequent schedule, usually when we can't fit anymore beer cans in it. &nbsp;Don't worry, nobody else can see your failures. &nbsp;Incinerator coming soon.</Text>
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
      {data && data.feed && <FeedGrid dreams={data.feed?data.feed:null} loading={loading} isAuthenticated={isAuthenticated} token={token} user = {user}/>}
      <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      />
    </>
  );
}
