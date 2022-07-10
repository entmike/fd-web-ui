import { Link as RouteLink } from 'react-router-dom';
import { SiDiscord } from 'react-icons/si';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Flex,
  HStack,
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
  Center,
  Square,
  Text,
} from '@chakra-ui/react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Configure,
} from 'react-instantsearch-hooks-web';

import { Link } from 'react-router-dom';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { LoginButton } from './LoginButton';
import { Profile } from './Profile';
// import SearchTypeahead from '../SearchTypeahead';

let Links = [
  { title: 'Random', url: '/random' },
  { title: 'Recent', url: '/recent/1' },
  { title: 'Status', url: '/agentstatus' },
  { title: 'Jobs', url: '/jobs' },
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
    to={{ pathname: url }}
  >
    {title}
  </Link>
);

const searchClient = algoliasearch(
  'SBW45H5QPH',
  '735cfe2686474a143a610f864474b2f2'
);

const SearchBar = ({}) => {
  return (
    <>
      <Configure hitsPerPage={50} />
      <SearchBox />
    </>
  );
};

export function Nav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated, logout, user } = useAuth0();

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'}>
          <IconButton
            size={'md'}
            w="30px"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Text
            paddingLeft="20px"
            w="180px"
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontSize="1.1em"
            fontWeight="bold"
          >
            <Link to="/">Fever Dreams</Link>
          </Text>
          <HStack spacing={8} alignItems={'center'}>
            {/* When the search is typed into, we will set */}
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              <SearchBar />
              {Links.map(({ title, url }) => (
                <NavLink as={RouteLink} key={title} title={title} url={url} />
              ))}
              {isAuthenticated && (
                <NavLink
                  as={RouteLink}
                  key="/dream"
                  title="Dream"
                  url="/dream"
                />
              )}
            </HStack>
          </HStack>
          <Flex marginLeft="auto" alignItems={'center'}>
            <IconButton
              m="1"
              onClick={() => {
                window.open('https://discord.gg/yNDqCnzCbs', '_blank');
              }}
              aria-label={`Discord`}
              icon={<SiDiscord />}
            />
            <IconButton
              m="1"
              onClick={toggleColorMode}
              aria-label={`Toggle ${
                colorMode === 'light' ? 'Dark' : 'Light'
              } Mode`}
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            />
            {isAuthenticated && (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                  pr="2"
                  pl="1"
                >
                  <Profile />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() =>
                      (window.location.href = `/gallery/${
                        user.sub.split('|')[2]
                      }/1`)
                    }
                  >
                    My Gallery
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onClick={() => logout({ returnTo: window.location.origin })}
                  >
                    Log Out
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
            {!isAuthenticated && <LoginButton />}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map(({ title, url }) => (
                // TODO: Make it close menu
                <NavLink key={title} title={title} url={url} />
              ))}
              {isAuthenticated && (
                <NavLink
                  as={RouteLink}
                  key="/dream"
                  title="Dream"
                  url="/dream"
                />
              )}
            </Stack>
          </Box>
        ) : null}
      </Box>

      {/* <Box p={4}>Main Content Here</Box> */}
    </>
  );
}
