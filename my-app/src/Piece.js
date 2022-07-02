import React from "react"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DreamAuthor from "./DreamAuthor";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Box,
    Heading,
    Link,
    Image,
    Text,
    Badge,
    Flex,
    Stack
  } from '@chakra-ui/react';

function dt(ts){
    let s = ""
    if (ts && ts["$date"]){
        s = ts.$date.toString()
    }else{
        s = new Date(ts).toString()
    }
    console.log(s)
    return s
}
export default function Piece() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let params = useParams();
    
    function fetchPiece() {
      let uuid = params.uuid
      fetch(`https://api.feverdreams.app/job/${uuid}`)
      .then((response) => {
        let obj = response.json()
        return obj
      })
      .then((actualData) => {
        console.log(actualData)
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
    
    useEffect(() => {
        fetchPiece()
    },[]);
    
    return <>
        {error}
        {!loading && <div>
          <Heading as='h3' size='lg'>
            <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
            {params.uuid}
            </Link>
        </Heading>
        <Box
        marginTop={{ base: '1', sm: '5' }}
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
        // justifyContent="space-between"
        >
        <Box
          display="flex"
          flex="1"
          marginRight="3"
          position="relative"
          // alignItems="center"
          >
          <Box
            width={{ base: '100%', sm: '85%' }}
            zIndex="2"
            marginLeft={{ base: '0', sm: '5%' }}
            marginTop="5%">
            <Link textDecoration="none" isExternal href={
                (data.status === 'processing')?`https://www.feverdreams.app/images/${params.uuid}_progress.png`
                :`https://www.feverdreams.app/images/${params.uuid}0_0.png`
              }>
              <Image
                borderRadius="lg"
                src={`https://api.feverdreams.app/thumbnail/${params.uuid}/512`}
                alt={data.text_prompt}
                objectFit="cover"
              />
            </Link>
          </Box>
          <Box zIndex="1" width="100%" position="absolute" height="100%">
            <Box
            //   bgGradient={useColorModeValue(
            //     'radial(orange.600 1px, transparent 1px)',
            //     'radial(orange.300 1px, transparent 1px)'
            //   )}
              backgroundSize="20px 20px"
              opacity="0.4"
              height="100%"
            />
          </Box>
        </Box>
            <Box
            display="flex"
            flex="1"
            flexDirection="column"
            // justifyContent="center"
            marginTop={{ base: '3', sm: '0' }}>
            {/* <BlogTags tags={['Engineering', 'Product']} /> */}
            <Stack direction='row'>
              <Badge variant='outline' colorScheme='green'>{data.model}</Badge>
              <Badge variant='outline' colorScheme='green'>{data.render_type}</Badge>
              <Badge variant='outline' colorScheme='green'>{`${data.steps} steps`}</Badge>
            </Stack>
            <Stack direction='row'>
              <Link color='green.500' isExternal href={`https://api.feverdreams.app/job/${params.uuid}`}>Job Details <ExternalLinkIcon mx='2px' /></Link> | <Link color='green.500' isExternal href={`https://api.feverdreams.app/config/${params.uuid}`}>YAML <ExternalLinkIcon mx='2px' /></Link>
            </Stack>
            <Text
                as="p"
                align="left"
                marginTop="2"
                // color={useColorModeValue('gray.700', 'gray.200')}
                fontSize="lg">
                {data.text_prompt}
            </Text>
            <DreamAuthor userdets={data.userdets} timestamp={data.timestamp} /><Text>—</Text><Text>{dt(data.timestamp)}</Text>
            </Box>
        </Box>
        </div>}
    </>;
}