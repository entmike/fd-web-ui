import { Link as RouteLink } from "react-router-dom";
import { SiDiscord } from 'react-icons/si'
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { LoginButton } from './LoginButton';
import { Profile } from './Profile';

let Links = [
  {title : 'Home', url: '/'},
  {title:'Random', url: '/random/25'},
  {title:'Recent', url: '/recent/50/1'},
  {title:'Status', url: '/agentstatus'},
  {title:'Jobs', url: '/jobs'}
];

const NavLink = ({ title, url }) => (
  <Link
    as={RouteLink}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    to={{pathname:url}}>{title}</Link>
);

export function Nav() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const { isAuthenticated, logout, user } = useAuth0();
  
  isAuthenticated && Links.push({title:'Dream', url: '/dream'})
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            {/* <Box>Logo</Box> */}
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {
              Links.map(({title, url}) => (
                <NavLink as={RouteLink} key={title} title={title} url={url} />
              ))
              }
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <IconButton onClick={()=>{window.open("https://discord.gg/yNDqCnzCbs","_blank")}} aria-label={`Discord`} icon={<SiDiscord/>} />
            <IconButton onClick={toggleColorMode} aria-label={`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`} icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} />
            {isAuthenticated && <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Profile />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => window.location.href=`https://www.feverdreams.app/gallery/${user.sub.split('|')[2]}/10/1`}>My Gallery</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>Log Out</MenuItem>
              </MenuList>
            </Menu>
            }
            {!isAuthenticated && <LoginButton/>}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map(({title, url}) => (
                <NavLink key={title} title={title} url={url} />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      {/* <Box p={4}>Main Content Here</Box> */}
    </>
  );
}