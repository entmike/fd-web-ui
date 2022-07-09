import React from 'react';
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

export function Gallery() {
  const params = useParams();

  return (
    <>
      <PaginationNav params={params} />
      <Feed user={params.user_id} amount={params.amount} page={1} />
      <PaginationNav params={params} />
    </>
  );
}
