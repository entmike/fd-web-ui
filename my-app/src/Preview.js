import React from "react"
import { Box, Image, Badge, Stack, HStack, AspectRatio, Text } from '@chakra-ui/react'
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

export default function Preview({uuid, model, render_type, text_prompt, duration, userdets, timestamp}){ 
        return (
          <Box width="512" borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <HStack>
              <Link to={`/piece/${uuid}`}>
                  <Image height="512px" width="512px" src={`https://api.feverdreams.app/thumbnail/${uuid}/1024`} alt={uuid} 
                  transition="0.3s ease-in-out"
                  // objectFit="contain"
                  style={{ objectFit: "cover"}}
                  _hover={{ transform: 'scale(1.05)'}} 
                  />
              </Link>
            
            </HStack>
          </Box>
        )
      }
    // return(
    // <>
    //     <img src={`https://api.feverdreams.app/thumbnail/${uuid}`} alt={uuid} />
    // </>
    // )