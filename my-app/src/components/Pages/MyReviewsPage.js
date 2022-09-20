import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Flex, Center, Skeleton, Heading, localStorageManager, Box, HStack, VStack, Badge} from '@chakra-ui/react';
import { Preview } from '../shared/Feed/Preview';
import { dt } from '../../utils/dateUtils';
import FeedGrid from '../shared/Feed/FeedGrid';
import FeedList from '../shared/Feed/FeedList';
import PaginationNav from '../shared/Feed/PaginationNav';

export default function MyReviewsPage(props) {
  let {isAuthenticated, token, user} = props
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [interrupt, setInterrupt] = useState(false);
  const interruptRef = useRef(interrupt)
  interruptRef.current = interrupt
  const [reload, setReload] = useState(true);
  const [timeoutId, setTimeoutId] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const type = params.type || "all"
  const apiURL = `${process.env.REACT_APP_api_url}/v3/myreviews/50/${params.page}`
  const prevURL = `/myreviews/${parseInt(params.page) - 1}`;
  const nextURL = `/myreviews/${parseInt(params.page) + 1}`;

  function handleOnDelete(index){
    let updatedData = JSON.parse(JSON.stringify(data))
    updatedData.splice(index,1)
    setData(updatedData)
    setInterrupt(false)
  }
  
  function checkMyReviews(page) {
    // console.log(timeoutId)
    setReload(false)
    if(fetching) {
      // console.log("Fetch already in progress.  Cancelling")
      return
    }
    if(token){
      // console.log(`Fetching page ${page}`)
      setFetching(true)
      const reviewURL = `${process.env.REACT_APP_api_url}/v3/myreviews/50/${page}`;
      const headers = {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
      }
      fetch(reviewURL,{headers})
      .then((response) => {
        return response.json()
      }).then(actualData=>{
        // console.log(interruptRef.current)
        if(!interruptRef.current) {
          setData(actualData)
          setInterrupt(false)
        }else{
          // console.log("Payload is out of date.  Waiting")
        }
        return actualData
      }).catch(err=>{
        console.log("ERRROR")
        console.log(err)
        setData([]);
        return []
      }).finally(d=>{
        // console.log(`Fetch for page ${page} completed.`)
        setFetching(false)
        setLoading(false)
        let timerId = setTimeout(()=>{setReload(true)}, 5000)
        setTimeoutId(timerId)
        return timerId
      })
    }else{
      // console.log("Not logged in!!")
    }

  }

  useEffect(() => {
    setLoading(true);
    checkMyReviews(params.page)
    if(timeoutId) return ()=>{clearTimeout(timeoutId)}
  }, [params.page, params.type, token, user, isAuthenticated]);

  useEffect(() => {
    // setLoading(true);
    checkMyReviews(params.page)
  }, [reload]);
  return (
    <>
      <Heading>My Reviews</Heading>
      <Text>Images in My Reviews can only be seen by you.  Click the Save button to move the image into your gallery, or use the Delete button to delete it.  This page will automatically update.</Text>
        <PaginationNav
          pageNumber={params.page}
          prevURL={prevURL}
          nextURL={nextURL}
        />
      {/* {
        data && <Center><VStack w={1024}>
          {data.map((piece,index)=>{
            return <HStack>
              <Box w={256} >
                <Preview mode={"review"} piece={piece} key={piece.uuid} isAuthenticated={isAuthenticated} token={token} user = {user} onDecided={()=>{
                  handleOnDelete(index)
                }}/>
            </Box>
            <Box>
              <Text>{dt(piece.timestamp)}</Text>
            </Box>
            </HStack>
          })}
        </VStack></Center>
      } */}
      <Skeleton isLoaded={!loading}>
        <FeedList pieces = {data} loading={loading} isAuthenticated={isAuthenticated} token={token} user={user} mode={"review"} onDelete={handleOnDelete}/>
      </Skeleton>
      {/* <FeedGrid dreams={data} loading={loading} isAuthenticated={isAuthenticated} token={token} user={user} mode={"review"} onDelete={handleOnDelete}/> */}
      <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      />
    </>
  );
}
