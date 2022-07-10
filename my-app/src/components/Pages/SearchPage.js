import React from 'react';
import { useParams } from 'react-router-dom';

import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';
import useFetchPaginated from '../../utils/useFetchPaginated';

export default function SearchPage() {
  const params = useParams();

  const apiURL = `https://api.feverdreams.app/search/${params.regexp}/50/${params.page}`;

  const prevURL = `/recent/${parseInt(params.page) - 1}`;
  const nextURL = `/recent/${parseInt(params.page) + 1}`;

  const { loading, data } = useFetchPaginated(apiURL, params);

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
