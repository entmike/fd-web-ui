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
import { HelpHeader } from '../shared/HelpHeader';
import { FaTwitter } from 'react-icons/fa';

export default function DeletedGalleryPage({ isAuthenticated, token, user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [include, setInclude] = useState(searchParams.getAll("include"));
  const [exclude, setExclude] = useState(searchParams.getAll("exclude"));

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
  
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

  return (
    <>
      <HStack>
        <VStack alignItems={'left'}>
          <HelpHeader
          title={`My Trash Can 💩`}
          description={`Accidentally delete something?  Changed your mind?  
          Just want to browse your terrible art fails in the privacy of your own garbage pile?  
          Welcome to your trash can!  Trash is emptied on a completely unpredictable and infrequent schedule, 
          usually when we can't fit anymore beer cans in it.  
          Don't worry, nobody else can see your failures.  
          Incinerator coming soon.`}/>
        </VStack>
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
