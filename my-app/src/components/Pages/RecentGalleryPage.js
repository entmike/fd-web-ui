import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center, Heading } from '@chakra-ui/react';

import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';

export default function RecentGalleryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const headers = {
    all : "Images",
    stable : "Stable Diffusion Images",
    disco : "Disco Diffusion Images",
    general : "General (Disco Diffusion)",
    portraits : "Portraits (Disco Diffusion)",
    isometric : "Isometric (Disco Diffusion)",
    "pixel-art" : "Pixel Art (Disco Diffusion)",
    "paint-pour" : "Paint and Pour (Disco Diffusion)",
  }
  const type = params.type || "all"
  const apiURL = `https://api.feverdreams.app/v3/recent/${type}/50/${params.page}`;

  const prevURL = `/recent/${type}/${parseInt(params.page) - 1}`;
  const nextURL = `/recent/${type}/${parseInt(params.page) + 1}`;

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
  }, [params.page, params.type]);

  console.log('loading', loading);

  return (
    <>
      <Heading>Recent {headers[type]}</Heading>
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
