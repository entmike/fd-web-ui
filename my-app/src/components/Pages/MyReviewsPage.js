import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center, Heading } from '@chakra-ui/react';

import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';

export default function MyReviewsPage({isAuthenticated, token, user}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const type = params.type || "all"
  const apiURL = `${process.env.REACT_APP_api_url}/v3/myreviews/50/${params.page}`;

  const prevURL = `/myreviews/${parseInt(params.page) - 1}`;
  const nextURL = `/myreviews/${parseInt(params.page) + 1}`;

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
    fetch(apiURL,{headers})
      .then((response) => response.json())
      .then((actualData) => {
        setData(actualData);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.page, params.type, token, user, isAuthenticated]);

  return (
    <>
      <Heading>My Reviews</Heading>
      <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      />
      <FeedGrid dreams={data} loading={loading} isAuthenticated={isAuthenticated} token={token} user={user} mode={"review"}/>
      <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      />
    </>
  );
}
