import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Configure,
} from 'react-instantsearch-hooks-web';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center, Button } from '@chakra-ui/react';
import { useHits } from 'react-instantsearch-hooks-web';

import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';

const searchClient = algoliasearch(
  'SBW45H5QPH',
  '735cfe2686474a143a610f864474b2f2'
);

export default function SearchPage() {
  const { hits, results, sendEvent } = useHits();

  return <FeedGrid dreams={hits} loading={false} />;
}
