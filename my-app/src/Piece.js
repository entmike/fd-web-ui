import React from "react"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DreamAuthor from "./DreamAuthor";

import {
    Box,
    Heading,
    Link,
    Image,
    Text,
    Divider,
    HStack,
    Tag,
    Wrap,
    WrapItem,
    SpaceProps,
    useColorModeValue,
    Container,
    VStack,
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
            <Box
        marginTop={{ base: '1', sm: '5' }}
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
        justifyContent="space-between">
        <Box
          display="flex"
          flex="1"
          marginRight="3"
          position="relative"
          alignItems="center">
          <Box
            width={{ base: '100%', sm: '85%' }}
            zIndex="2"
            marginLeft={{ base: '0', sm: '5%' }}
            marginTop="5%">
            <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
              <Image
                borderRadius="lg"
                src={`https://api.feverdreams.app/image/${params.uuid}`}
                alt="some good alt text"
                objectFit="contain"
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
            justifyContent="center"
            marginTop={{ base: '3', sm: '0' }}>
            {/* <BlogTags tags={['Engineering', 'Product']} /> */}
            <Heading marginTop="1">
                <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
                {params.uuid}
                </Link>
            </Heading>
            <Text
                as="p"
                marginTop="2"
                // color={useColorModeValue('gray.700', 'gray.200')}
                fontSize="lg">
                {data.text_prompt}
            </Text>
            <DreamAuthor avatar={data.userdets.avatar} name={data.userdets.user_name} timestamp={data.timestamp} /><Text>—</Text><Text>{dt(data.timestamp)}</Text>
            </Box>
        </Box>
        </div>}
    </>;
}