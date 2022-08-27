import { ReactNode } from 'react';
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  Image,
  VisuallyHidden,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import { SiDiscord } from 'react-icons/si';

// import AppStoreBadge from '@/components/AppStoreBadge';
// import PlayStoreBadge from '@/components/PlayStoreBadge';

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export function FdFooter() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
          {/* <Stack align={'flex-start'}>
            <ListHeader>About</ListHeader>
            <Link href={'#'}>About Fever Dreams</Link>
            <Link href={'#'}>Contact</Link>
          </Stack> */}

          <Stack align={'flex-start'}>
            <ListHeader>Community</ListHeader>
            {/* <Link href={'https://discord.gg/yNDqCnzCbs'}>Discord</Link> */}
            <Stack direction={'row'} spacing={6}>
            <SocialButton label={'Twitter'} href={'https://twitter.com/FeverDreamsAI'}>
              <FaTwitter/>
            </SocialButton>
            <SocialButton label={'Discord'} href={'https://discord.gg/yNDqCnzCbs'}>
              <SiDiscord />
            </SocialButton>
            <SocialButton label={'Instagram'} href={'https://www.instagram.com/feverdreamsai'}>
              <FaInstagram />
            </SocialButton>
          </Stack>
          </Stack>

          <Stack align={'flex-start'}>
          <ListHeader>Friends of Fever Dreams</ListHeader>
            <Box borderWidth={1} p={5} borderRadius="md">
            <Link href={'https://www.runpod.io/blog/accelerate-your-generate-art-with-disco-diffusion-and-runpod?ref=feverdreams'} target="_blank"><span style={{
              fontFamily:`Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
              fontWeight:700
            }}>Run<span style={{ color:`rgb(103, 58, 183)`}}>Pod</span></span></Link>
            <Text fontSize={"xs"}>GPU compute superheros like RunPod and other community members make this project possible.  Visit their website and see how you can take your AI art to the next level!</Text>
            </Box>
          </Stack>
          
          <Stack align={'flex-start'}>
            <ListHeader>Powered by DiscoArt</ListHeader>
            <Box borderWidth={1} p={5} borderRadius="md">
              <Link href={'https://github.com/jina-ai/discoart'} target="_blank"><Image src="/friends/jina-ai-logo-color.svg" height={8}></Image></Link>
              <Text fontSize={"xs"}>Jina AI makes creating and integrating Disco Diffusion workflows simple with DiscoArt.  Visit their repo and give their GitHub Repository  a ⭐!</Text>
            </Box>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}>
          <Text>© 2022 Fever Dreams. All rights reserved</Text>
        </Container>
      </Box>
    </Box>
  );
}