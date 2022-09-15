import { ReactNode } from 'react';
import {
  Box,
  Center,
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
    <>
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container as={Stack} maxW={'6xl'} py={10}>
      <ListHeader>Friends of Fever Dreams</ListHeader>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
          {/* <Stack align={'flex-start'}>
            <ListHeader>About</ListHeader>
            <Link href={'#'}>About Fever Dreams</Link>
            <Link href={'#'}>Contact</Link>
          </Stack> */}
          <Box borderWidth={1} p={5} borderRadius="md" h={"100%"}>
          <Link href={'http://www.redmond.ai/'} target="_blank">
            <Image src="/friends/redmond-logo.png" h={14}/><br />
          </Link>
          <Text fontSize={"xs"}>Donating hardware and infrastructure to Fever Dreams.  Your high-performance AI cloud infrastructure. Dedicated or on-demand 80gb A100s and world record storage performance.</Text>
          </Box>

          <Box borderWidth={1} p={5} borderRadius="md" h={"100%"}>
          <Link href={'https://www.runpod.io/blog/accelerate-your-generate-art-with-disco-diffusion-and-runpod?ref=feverdreams'} target="_blank"><span style={{
            fontFamily:`Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
            fontWeight:700,
            fontSize:32
          }}>Run<span style={{ color:`rgb(103, 58, 183)`}}>Pod</span></span></Link>
          <Text mt={5} fontSize={"xs"}>GPU compute superheros like RunPod and other community members make this project possible.  Visit their website and see how you can take your AI art to the next level!</Text>
          </Box>
        
          <Box borderWidth={1} p={5} borderRadius="md" h={"100%"}>
            <Link href={'https://github.com/jina-ai/discoart'} target="_blank">
              <Image src="/friends/jina-ai-logo-color.svg" h={12} mb={5}/>
            </Link>
            <Text fontSize={"xs"}>Jina AI makes creating and integrating Disco Diffusion workflows simple with DiscoArt.  Visit their repo and give their GitHub Repository  a ⭐!</Text>
          </Box>
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
          {/* <Text>© 2022 Fever Dreams. All rights reserved</Text> */}
          <Stack direction={'row'} spacing={6}>
            <SocialButton label={'Twitter'} href={'https://twitter.com/FeverDreamsAI'}>
              <FaTwitter/>
            </SocialButton>
            <SocialButton label={'Discord'} href={'https://discord.gg/feverdreams'}>
              <SiDiscord />
            </SocialButton>
            <SocialButton label={'Instagram'} href={'https://www.instagram.com/feverdreamsai'}>
              <FaInstagram />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </Box>
    <Box p={5}>
        <Link href="https://www.buymeacoffee.com/entmike"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&slug=entmike&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></Link>
        <small>Totally optional, but totally appreciated!  Donations help keep this site running and free to use.</small>
    </Box>
    </>
  );
}