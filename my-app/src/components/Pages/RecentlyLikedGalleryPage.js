import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center, Heading } from '@chakra-ui/react';
import { HelpHeader } from '../shared/HelpHeader';
import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';

export default function RecentlyLikedGalleryPage({isAuthenticated, token, user, permissions}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const headers = {
    all : "Images",
    dream : "Dreams",
    hallucination : "Hallucinations",
    stable : "Stable Diffusion Images",
    disco : "Disco Diffusion Images",
    general : "General (Disco Diffusion)",
    portraits : "Portraits (Disco Diffusion)",
    isometric : "Isometric (Disco Diffusion)",
    "pixel-art" : "Pixel Art (Disco Diffusion)",
    "paint-pour" : "Paint and Pour (Disco Diffusion)",
  }
  const type = params.type || "all"
  const apiURL = `${process.env.REACT_APP_api_url}/v3/recentlikes/50/${params.page}`;

  const prevURL = `/recentlyliked/${parseInt(params.page) - 1}`;
  const nextURL = `/recentlyliked/${parseInt(params.page) + 1}`;

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
        console.log(permissions)
      });
  }, [params.page, params.type, token, user, isAuthenticated, permissions]);

  return (
    <>
      <HelpHeader
        title={`Recently Liked Art`}
        description={`Images recently liked by the Fever Dreams community`}/>
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
