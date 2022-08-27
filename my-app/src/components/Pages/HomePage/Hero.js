import {
  Heading,
  Stack,
  Text,
  Image,
  Box,
  Center,
} from '@chakra-ui/react';
import { CaptionCarousel } from './CaptionCarousel.js';
import { Stats } from '../../shared/Stats.js';
export function Hero() {
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
          filter: 'blur(50px)',
          zIndex: '-1',
          transform: 'scale(3.0)',
          "transform-origin": "50% 50%"
        }}
        objectFit="contain"
        src="https://images.feverdreams.app/jpg/e61688efecd603911360860957e50b783aee6b0917d920a720451ba6928303db.jpg"
      />
      <Stats />
    </Box>
    {/* <Stack direction={{ base: 'column', md: 'column' }} h={"750"}>
      <Stack spacing={6} w={'full'} maxW={'lg'}>
        
      </Stack>
      
    </Stack> */}
    </>
  );
}
