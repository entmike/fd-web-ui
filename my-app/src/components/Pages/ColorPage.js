import React from 'react';
import { useParams } from 'react-router-dom';

import FeedGrid from '../shared/Feed/FeedGrid';
import PaginationNav from '../shared/Feed/PaginationNav';
import useFetchPaginated from '../../utils/useFetchPaginated';

export default function ColorPage() {
  const params = useParams();

  const apiURL = `https://api.feverdreams.app/rgb/${params.r}/${params.g}/${params.b}/${params.range}/${params.amount}/${params.page}`;

  const prevURL = `/rgb/${params.r}/${params.g}/${params.b}/${params.range}/${
    params.amount
  }/${parseInt(params.page) - 1}`;

  const nextURL = `/rgb/${params.r}/${params.g}/${params.b}/${params.range}/${
    params.amount
  }/${parseInt(params.page) + 1}`;

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
