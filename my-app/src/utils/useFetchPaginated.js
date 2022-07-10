import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function useFetchPaginated(apiURL, params) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [params.page, apiURL]);

  return { error, data, loading };
}

useFetchPaginated.propTypes = {
  apiURL: PropTypes.string,
  params: PropTypes.shape({
    page: PropTypes.number,
  }),
};

export default useFetchPaginated;
