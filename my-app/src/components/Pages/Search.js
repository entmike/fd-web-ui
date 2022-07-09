import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center } from '@chakra-ui/react';
import { Feed } from '../shared/Feed';
import SearchTypeahead from '../shared/SearchTypeahead';

export function Search() {
  let params = useParams();

  return (
    <>
      <h1>Search Page</h1>
      <SearchTypeahead />

      <Center>
        <Flex>
          <Link
            to={`/search/${params.regexp}/${params.amount}/${parseInt(
              parseInt(params.page) - 1
            )}`}
          >
            ◀️
          </Link>
          <Center>
            <Text>{params.page}</Text>
          </Center>
          <Link
            to={`/search/${params.regexp}/${params.amount}/${parseInt(
              parseInt(params.page) + 1
            )}`}
          >
            ▶️
          </Link>
        </Flex>
      </Center>
      <Feed
        type="search"
        regexp={params.regexp}
        amount={params.amount}
        page={1}
      />
      <Center>
        <Flex>
          <Link
            to={`/search/${params.regexp}/${params.amount}/${parseInt(
              parseInt(params.page) - 1
            )}`}
          >
            ◀️
          </Link>
          <Center>
            <Text>{params.page}</Text>
          </Center>
          <Link
            to={`/search/${params.regexp}/${params.amount}/${parseInt(
              parseInt(params.page) + 1
            )}`}
          >
            ▶️
          </Link>
        </Flex>
      </Center>
    </>
  );
}
