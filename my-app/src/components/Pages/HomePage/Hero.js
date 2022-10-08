import {
  Heading,
  Stack,
  Text,
  Image,
  Box,
  Container,
} from '@chakra-ui/react';
import { CaptionCarousel } from './CaptionCarousel.js';
import FeedGrid from '../../shared/Feed/FeedGrid';
import PaginationNav from '../../shared/Feed/PaginationNav';
import { useState, useEffect } from 'react';
import { Stats } from './Stats.js';
export function Hero({isAuthenticated, token, user}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const apiURL = `${process.env.REACT_APP_api_url}/v3/recentlikes/10/1`;

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
  }, []);

  return (
    <>
    <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
      <Text
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
        // fontSize="lg"
        fontWeight="bold"
        whiteSpace="nowrap"
        pl={{ base: 2, md: 0 }}
        mb={5}
        display={{ md: 'flex' }}
      >
        Fever Dreams
      </Text>
    </Heading>
    <Box rounded={"xl"} position={'relative'} p={5} style={{ overflow:"hidden" }}>
      <Image
        position={'absolute'}
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={{
          filter: 'blur(25px)',
          zIndex: '-1',
          transform: 'scale(3.0)',
          transformOrigin: "50% 50%"
        }}
        objectFit="contain"
        src="https://images.feverdreams.app/jpg/e61688efecd603911360860957e50b783aee6b0917d920a720451ba6928303db.jpg"
      />
      <Stats />
    </Box>
      <Container as={Stack} maxW={'6xl'} py={10}>
      <Heading>Recently Liked</Heading>
        {/* <PaginationNav
          pageNumber={params.page}
          prevURL={prevURL}
          nextURL={nextURL}
        /> */}
        <FeedGrid dreams={data} loading={loading} isAuthenticated={isAuthenticated} token={token} user={user}/>
      </Container>
      {/* <PaginationNav
        pageNumber={params.page}
        prevURL={prevURL}
        nextURL={nextURL}
      /> */}
    {/* <Stack direction={{ base: 'column', md: 'column' }} h={"750"}>
      <Stack spacing={6} w={'full'} maxW={'lg'}>
        
      </Stack>
      
    </Stack> */}
    </>
  );
}
