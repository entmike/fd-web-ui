import {
    Flex,
    Heading,
    Stack,
    Text,
    useBreakpointValue, Center
  } from '@chakra-ui/react';
import { CaptionCarousel } from './CaptionCarousel.js';
  
export function Hero() {
  return (
    <Stack direction={{ base: 'column', md: 'column' }}>
        <Stack spacing={6} w={'full'} maxW={'lg'}>
          <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
            <Text
              as={'span'}
              position={'relative'}
              _after={{
                content: "''",
                width: 'full',
                height: useBreakpointValue({ base: '20%', md: '30%' }),
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: 'blue.400',
                zIndex: -1,
              }}>
              Welcome
            </Text>
            <br />{' '}
            <Text color={'blue.400'} as={'span'}>
              Fever Dreams
            </Text>{' '}
          </Heading>
          <Text fontSize={{ base: 'md', lg: 'lg' }} color={'whiteAlpha.900'}>
            Browse generative AI art created openly by other users.
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          </Stack>
        </Stack>
        <Center>
          <CaptionCarousel amount={10} />
        </Center>
    </Stack>
  );
}