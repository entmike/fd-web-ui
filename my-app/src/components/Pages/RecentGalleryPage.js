import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center, Button } from '@chakra-ui/react';

import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';

export default function RecentGalleryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();

  const apiURL = `https://api.feverdreams.app/recent/50/${params.page}`;

  const prevURL = `/recent/${parseInt(params.page) - 1}`;
  const nextURL = `/recent/${parseInt(params.page) + 1}`;

  useEffect(() => {
    setLoading(true);

    fetch(apiURL)
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
  }, [params.page]);

  console.log('loading', loading);

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
