import React from "react"
import { Box, Image, HStack } from '@chakra-ui/react'
import { Link } from "react-router-dom"

export function Preview({uuid, model, render_type, text_prompt, duration, userdets, timestamp}){ 
        return (
          <Box width="512" borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <HStack>
              <Link to={`/piece/${uuid}`}>
                  <Image height="512px" width="512px" src={`https://api.feverdreams.app/thumbnail/${uuid}/1024`} alt={uuid} 
                  transition="0.3s ease-in-out"
                  // objectFit="contain"
                  style={{ objectFit: "cover"}}
                  _hover={{ transform: 'scale(1.1)'}} 
                  />
              </Link>
            
            </HStack>
          </Box>
        )
      }
