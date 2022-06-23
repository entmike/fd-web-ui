import { useState, useEffect } from "react";
import { SimpleGrid } from '@chakra-ui/react'
import Preview from "./Preview";


export default function Feed({type, amount}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function fetchFeed(type, amount) {
      fetch(`https://api.feverdreams.app/${type}/${amount}`)
      .then((response) => {
        return response.json()
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

    // https://exerror.com/react-hook-useeffect-has-a-missing-dependency/
    useEffect(() => {
      fetchFeed(type, amount)
    },[ type, amount]);
    return (
      
        <div>
          {loading && <div>A moment please...</div>}
          {error && (
            <div>{`There is a problem fetching the post data - ${error}`}</div>
          )}
          <SimpleGrid minChildWidth='256px' spacing = {20}>
          {data &&
            data.map(({ uuid, author, text_prompt, render_type, duration, userdets, timestamp}) => (
              <Preview userdets={userdets} timestamp={timestamp} key={uuid} uuid={uuid} text_prompt={text_prompt} render_type={render_type} duration={duration}/>
            ))}
          </SimpleGrid>
          {/* <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Welcome to Fever Dreams
            </p>
          </header> */}
        </div>
    );
  }