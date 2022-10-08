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
  FormLabel
} from '@chakra-ui/react';
import FeedGrid from '../shared/Feed/FeedGrid';
import { SocialButton } from 'components/shared/SocialButton';
import PaginationNav from '../shared/Feed/PaginationNav';
import { FaTwitter } from 'react-icons/fa';

export default function UserGalleryPage({ isAuthenticated, token, user }) {
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
    let url = `${process.env.REACT_APP_api_url}/v3/userfeed/${params.user_id}/50/${params.page}?q=1`
    if(exclude.length>0){
      url += `&exclude=${exclude.join(',')}`
    }
    if(include.length>0){
      url += `&include=${include.join(',')}`
    }
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
  }, [params.user_id, params.page, token, user, isAuthenticated, include, exclude]);

  const prevURL = `/gallery/${params.user_id}/${parseInt(params.page) - 1}`;
  const nextURL = `/gallery/${params.user_id}/${parseInt(params.page) + 1}`;

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
        {userDetails && <Avatar size="xl" src={userAvatar} />}
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
      </HStack>
      <FormControl>
        <FormLabel htmlFor="dreams">Include Dreams</FormLabel>
        <Switch
          id="dreams"
          isChecked={(()=>{return !exclude.find(e=>e==="dream"?true:false)})()}
          onChange={(event) => {
            let updatedExclude = JSON.parse(JSON.stringify(exclude));
            let index = updatedExclude.findIndex(e=>e==="dream"?true:false)
            if(index!==-1) updatedExclude.splice(index, 1)
            let checked = event.target.checked ? true : false;
            if(!checked) updatedExclude.push("dream")
            setExclude(updatedExclude);
            
            let p = {}
            
            if(include.length>0) p.include = include.join(",")
            if(updatedExclude.length>0) p.exclude = updatedExclude.join(",")

            navigate({
              pathname: `/gallery/${params.user_id}/${parseInt(params.page)}`,
              search: `?${createSearchParams(p)}`,
            });
          }}
        />
      </FormControl>
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
