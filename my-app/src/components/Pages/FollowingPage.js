import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center, Button } from '@chakra-ui/react';

import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';

export default function FollowingPage({ isAuthenticated, token }) {
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
        `${process.env.REACT_APP_api_url}/following`,
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
  }, [isAuthenticated, token]);


  console.log('loading', loading);
  if (!isAuthenticated) {
    return <Text>You are not logged in. To see your feed, log in first.</Text>;
  }
  return (
    <>
      <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      />
      <FeedGrid dreams={data} loading={loading} />
      <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      />
    </>
  );
}
