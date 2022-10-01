import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heading, Text, Flex, Center, Button } from '@chakra-ui/react';

import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';
import {HelpHeader} from '../shared/HelpHeader';

export default function FollowingPage({ isAuthenticated, token , user}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();

  const apiURL = `${process.env.REACT_APP_api_url}/following`;

  const prevURL = `/following/${parseInt(params.page) - 1}`;
  const nextURL = `/following/${parseInt(params.page) + 1}`;

  async function getJob(token) {
    setLoading(true);
    try {
      const jobData = await fetch(
        `${process.env.REACT_APP_api_url}/following/feed/50/${params.page}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          return data;
        });

      if (jobData) {
        setData(jobData);
        console.log(jobData)
        setLoading(false);
      }

      setLoading(false);
    } catch (error) {
      console.log('Unable to get job...');
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
        getJob(token);
      } else {
        console.log('Not Authenticated.');
      }
  }, [isAuthenticated, token, params.page]);


  console.log('loading', loading);
  if (!isAuthenticated) {
    return <Text>You are not logged in. To see your feed, log in first.</Text>;
  }
  return (
    <>
    <HelpHeader
      title={`Following Feed`}
      description={`Images from people you follow.  (Or stalk.  No judgement here.)`}/>
      
      <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      />
      <FeedGrid dreams={data} loading={loading} isAuthenticated={isAuthenticated} token={token} user={user}/>
      <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      />
    </>
  );
}
