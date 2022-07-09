import React from 'react';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center } from '@chakra-ui/react';
import { Feed } from './shared/Feed';

const PaginationNav = ({ params }) => (
  <Center mt={2} mb={2} fontSize="lg">
    <Link
      to={`/gallery/${params.user_id}/${params.amount}/${parseInt(
        parseInt(params.page) - 1
      )}`}
    >
      ◀️
    </Link>

    <Text mr={1} ml={1}>
      {params.page}
    </Text>

    <Link
      to={`/gallery/${params.user_id}/${params.amount}/${parseInt(
        parseInt(params.page) + 1
      )}`}
    >
      ▶️
    </Link>
  </Center>
);

export function UserGallery() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();

  const url = `https://api.feverdreams.app/userfeed/${params.user_id}/${params.amount}/${params.page}`;

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

  return (
    <>
      <PaginationNav params={params} />
      <Feed user={params.user_id} amount={params.amount} page={1} />
      <PaginationNav params={params} />
    </>
  );
}
