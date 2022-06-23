import React from "react"
import { Box, Image, Badge, AspectRatio, Text } from '@chakra-ui/react'
import DreamAuthor from "./DreamAuthor"
import { Link } from "react-router-dom"

function dt(ts){
  let s = ""
  if (ts && ts["$date"]){
      s = ts.$date.toString()
  }else{
      s = new Date(ts).toString()
  }
  // console.log(s)
  return s
}

export default function Preview({uuid, render_type, text_prompt, duration, userdets, timestamp}){ 
        return (
          <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <AspectRatio maxW='400px' ratio={4 / 3}>
              <Link to={`/piece/${uuid}`}>
                <Image src={`https://api.feverdreams.app/thumbnail/${uuid}/512`} alt={uuid} 
                transition="0.3s ease-in-out"
                objectFit="contain"
                width="100%"
                _hover={{ transform: 'scale(1.05)'}} 
                />
              </Link>
            </AspectRatio>
            <Box p='6'>
              <Box display='flex' alignItems='baseline'>
                <Badge borderRadius='full' px='2' colorScheme='teal'>
                {render_type || "render"}
                </Badge>
                <Box
                  color='gray.500'
                  fontWeight='semibold'
                  letterSpacing='wide'
                  fontSize='xs'
                  textTransform='uppercase'
                  ml='2'
                >
                  {/* {property.beds} beds &bull; {property.baths} baths */}
                </Box>
              </Box>
      
              <Box
                mt='1'
                fontWeight='semibold'
                as='h4'
                lineHeight='tight'
                noOfLines={1}
              >
                {text_prompt}
              </Box>
              <DreamAuthor userdets={userdets} timestamp={timestamp} />
              <Box>
                {/* {property.formattedPrice} */}
                <Box as='span' color='gray.600' fontSize='sm'>
                  {dt(timestamp)}
                </Box>
              </Box>
      
              
            </Box>
          </Box>
        )
      }
    // return(
    // <>
    //     <img src={`https://api.feverdreams.app/thumbnail/${uuid}`} alt={uuid} />
    // </>
    // )