import {
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  Center,
} from '@chakra-ui/react';
import { CaptionCarousel } from './CaptionCarousel.js';
import { Stats } from '../../shared/Stats.js';
export function Hero() {
  return (
    <Stack direction={{ base: 'column', md: 'column' }}>
      <Stack spacing={6} w={'full'} maxW={'lg'}>
        <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
          <Text
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            // fontSize="lg"
            fontWeight="bold"
            whiteSpace="nowrap"
            pl={{ base: 2, md: 0 }}
            display={{ md: 'flex' }}
          >
            Fever Dreams
          </Text>
        </Heading>
        {/* <Text fontSize={{ base: 'md', lg: 'lg' }} color={'whiteAlpha.900'}>
          Browse generative AI art created openly by other users.
        </Text> */}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}></Stack>
      </Stack>
      <Center>
        <CaptionCarousel amount={10} />
      </Center>
      <Stats />
    </Stack>
  );
}
