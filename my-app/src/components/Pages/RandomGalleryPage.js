import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center } from '@chakra-ui/react';
import FeedGrid from '../shared/Feed/FeedGrid';

export default function RandomGalleryPage({isAuthenticated, token, user}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const params = useParams();

    useEffect(() => {
      if(!params) return
      console.log(params)
      setLoading(true);
      const url = `https://api.feverdreams.app/random/${params.type}/50`;
      fetch(url)
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
  }, [token, user, isAuthenticated]);

  return <FeedGrid dreams={data} loading={loading} isAuthenticated={isAuthenticated} token={token} user = {user}/>;
}
