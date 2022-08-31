import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center, Button } from '@chakra-ui/react';

import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';

export default function ColorPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();

  const apiURL = `${process.env.REACT_APP_api_url}/rgb/${params.r}/${params.g}/${params.b}/${params.range}/${params.amount}/${params.page}`;

  const prevURL = `/rgb/${params.r}/${params.g}/${params.b}/${params.range}/${
    params.amount
  }/${parseInt(params.page) - 1}`;

  const nextURL = `/rgb/${params.r}/${params.g}/${params.b}/${params.range}/${
    params.amount
  }/${parseInt(params.page) + 1}`;

  useEffect(() => {
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
