import React from 'react';
import { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { Skeleton, Center } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Preview } from './Preview';

export function Feed({ type, amount, user_id, regexp }) {
  let d = [];
  for (let i = 0; i < 20; i++) {
    d.push({
      uuid: `xxxx-xx-xxxxx-${i}`,
    });
  }
  const [data, setData] = useState(d);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function fetchFeed(type, amount, page, user_id, regexp) {
    let url = `https://api.feverdreams.app/${type}/${amount}/${page}`;

    if (type === 'random') {
      url = `https://api.feverdreams.app/${type}/${amount}`;
    } else if (user_id) {
      url = `https://api.feverdreams.app/userfeed/${user_id}/${amount}/${params.page}`;
    } else if (type === 'search') {
      url = `https://api.feverdreams.app/search/${regexp}/${amount}/${params.page}`;
    } else if (type === 'rgb') {
      url = `https://api.feverdreams.app/rgb/${params.r}/${params.g}/${params.b}/${params.range}/${amount}/${params.page}`;
    }

    fetch(url)
      .then((response) => {
        return response.json();
      })
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
  }

  let params = useParams();

  useEffect(() => {
    // console.log(history)
    // console.log(params)
    let page = params ? (params.page ? params.page : 1) : 1;
    let amount = params ? (params.amount ? params.amount : 10) : 10;
    fetchFeed(
      type,
      amount,
      page,
      params.user_id ? params.user_id : null,
      params.regexp
    );
    // if (history === "POP") {
    //   setCameByBackButton(true);
    //   console.log("User went back")
    // }else{
    //   let page = params?params.page?params.page:1:1
    //   let amount = params?params.amount?params.amount:10:10
    //   fetchFeed(type, amount, page, params.user_id, params.regexp)
    // }
  }, [params]);

  return (
    <div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 300: 1, 480: 2, 560: 3, 821: 4, 992: 4 }}
      >
        <Masonry gutter="16x">
          {error && <div>{`There is a problem fetching the data - ${error}`}</div>}
          {data?.map(
            ({
              uuid,
              author,
              text_prompt,
              render_type,
              duration,
              userdets,
              timestamp,
              dominant_color,
              thumbnails,
            }) => (
              <Skeleton margin=".25em" borderRadius="lg" minHeight="50px" min-width="360px" isLoaded={!loading}>
                <Center>
                  <Preview
                    width="460x"
                    thumbnails={thumbnails}
                    dominant_color={dominant_color ? dominant_color : [0, 0, 0]}
                    userdets={userdets}
                    timestamp={timestamp}
                    key={uuid}
                    uuid={uuid}
                    text_prompt={text_prompt}
                    render_type={render_type}
                    duration={duration}
                  />
                </Center>
              </Skeleton>
            )
          )}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
