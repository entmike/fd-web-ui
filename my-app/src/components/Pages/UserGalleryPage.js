import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center } from '@chakra-ui/react';
import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';

export default function UserGalleryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();

  const url = `https://api.feverdreams.app/userfeed/${params.user_id}/50/${params.page}`;

  useEffect(() => {
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
  }, [params.user_id, params.page]);

  const prevURL = `/gallery/${params.user_id}/${parseInt(params.page) - 1}`;
  const nextURL = `/gallery/${params.user_id}/${parseInt(params.page) + 1}`;

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
