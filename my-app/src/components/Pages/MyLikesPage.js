import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center, Heading } from '@chakra-ui/react';

import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';

export default function MyLikesPage({isAuthenticated, token, user}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const headers = {
    all : "Images",
    dream : "Dreams",
    stable : "Stable Diffusion Images",
    disco : "Disco Diffusion Images",
    general : "General (Disco Diffusion)",
    portraits : "Portraits (Disco Diffusion)",
    isometric : "Isometric (Disco Diffusion)",
    "pixel-art" : "Pixel Art (Disco Diffusion)",
    "paint-pour" : "Paint and Pour (Disco Diffusion)",
  }
  const type = params.type || "all"
  const apiURL = `${process.env.REACT_APP_api_url}/v3/myfavs/50/${params.page}`;

  const prevURL = `/myfavs/${parseInt(params.page) - 1}`;
  const nextURL = `/myfavs/${parseInt(params.page) + 1}`;

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

  // console.log('loading', loading);

  return (
    <>
      <Heading>My Favorite {headers[type]}</Heading>
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
