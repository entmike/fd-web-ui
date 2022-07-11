import { useEffect, useState, useRef } from 'react';
import {
  Link as RouteLink,
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from 'react-router-dom';
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
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Configure,
} from 'react-instantsearch-hooks-web';
import { useSearchBox } from 'react-instantsearch-hooks-web';
import debounce from 'lodash.debounce';

import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { LoginButton } from './LoginButton';
import { Profile } from './Profile';

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

// URL setting - https://github.com/algolia/react-instantsearch/blob/master/examples/react-router/src/App.js
const CustomSearchBox = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { query, refine, clear, isSearchStalled } = useSearchBox(props);
  const navigate = useNavigate(); // https://reactrouter.com/docs/en/v6/hooks/use-navigate

  // Set the search state once on load if a query ("q") is present in URL.
  useEffect(() => {
    refine(searchParams.get('q'));
  }, []);

  const debouncedSearch = useRef(
    debounce((searchTerm) => refine(searchTerm), 500)
  ).current;

  return (
    <>
      <Configure hitsPerPage={50} />

      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Search2Icon color="gray.300" />}
        />
        <Input
          type="text"
          placeholder="Search dreams"
          value={searchParams.get('q') ?? ''}
          onChange={(e) => {
            // This updates the search term sent to Algolia / maintained in the InstantSearch context.
            debouncedSearch(e.target.value);

            navigate(`/search?q=${encodeURIComponent(e.target.value)}`, {
              replace: true,
            });
          }}
        />
      </InputGroup>
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
            mr={{ base: 2, md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Text
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontSize="1.1em"
            fontWeight="bold"
            whiteSpace="nowrap"
          >
            <Link to="/">Fever Dreams</Link>
          </Text>

          <Box p={{ base: 2, md: 4 }} pl={{ base: 4 }}>
            <CustomSearchBox />
          </Box>

          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map(({ title, url }) => (
              <NavLink as={RouteLink} key={title} title={title} url={url} />
            ))}
            {isAuthenticated && (
              <NavLink as={RouteLink} key="/dream" title="Dream" url="/dream" />
            )}
          </HStack>

          <Flex marginLeft="auto" alignItems={'center'}>
            <IconButton
              m="1"
              onClick={() => {
                window.open('https://discord.gg/yNDqCnzCbs', '_blank');
              }}
              aria-label={`Discord`}
              icon={
                <SiDiscord
                  style={{ display: 'inline-block', verticalAlign: 'middle' }}
                />
              }
              display={{ base: 'none', md: 'block' }}
            />
            <IconButton
              m="1"
              onClick={toggleColorMode}
              aria-label={`Toggle ${
                colorMode === 'light' ? 'Dark' : 'Light'
              } Mode`}
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              display={{ base: 'none', md: 'block' }}
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
    </>
  );
}
