import React from 'react';
import { useParams } from 'react-router-dom';

import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';
import useFetchPaginated from '../../utils/useFetchPaginated';

export default function RecentGalleryPage() {
  const params = useParams();

  const apiURL = `https://api.feverdreams.app/recent/50/${params.page}`;

  const prevURL = `/recent/${parseInt(params.page) - 1}`;
  const nextURL = `/recent/${parseInt(params.page) + 1}`;

  const { loading, data } = useFetchPaginated(apiURL, params);

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
