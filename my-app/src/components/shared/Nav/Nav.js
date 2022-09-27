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
import { last } from 'lodash';

let Links = [
  { title: 'Random', url: '/random' },
  { title: 'Recent', url: '/recent/1' },
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

export function Nav({myInfo}) {
  let ack = 0
  if(localStorage.getItem("lastAck")) ack = parseInt(localStorage.getItem("lastAck"))

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated, logout, user } = useAuth0();
  const [ lastAck, setLastAck] = useState(ack);
  const [ announcement, setAnnouncement] = useState([{
    text : `ℹ️ Disco Diffusion creation functionality is offline while website and database maintenance is carried out.
    Your existing Disco Diffusion renders will not be unavailable during this time, however they have NOT been deleted.
    Stable Diffusion functionality is not affected.  See Discord announcements for more details.`,
    id : 1
  },{
    text : `ℹ️ Beginning now, all rendered pieces will first land in your "My Reviews" section that can be found in your user menu.  My Reviews allows you to choose the images you want to keep and which you want to delete.`,
    id : 2
  }])
  const navigate = useNavigate();
  
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'}>
          {/* <IconButton
            size={'md'}
            w="30px"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            mr={{ base: 2, md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          /> */}
          <Text
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontSize="lg"
            fontWeight="bold"
            whiteSpace="nowrap"
            pl={{ base: 2, md: 0 }}
            display={{ base: 'none', md: 'flex' }}
          >
            <Link to="/">Fever Dreams</Link>
          </Text>

          <Box p={{ base: 2, md: 4 }} pl={{ base: 4, md: 8 }} flex="1">
            {/* <CustomSearchBox /> */}
          </Box>

          {/* <HStack
            as={'nav'}
            spacing={4}
            p={4}
            pr={8}
            display={{ base: 'none', md: 'flex' }}
          >
            {Links.map(({ title, url }) => (
              <NavLink as={RouteLink} key={title} title={title} url={url}/>
            ))}
          </HStack> */}
          <Menu>
              {/* <Button variant={'outline'} colorScheme="blue" onClick={() =>
                (window.location.href = `/recent/stable/1`)
              }>Browse</Button> */}
              <MenuButton
                colorScheme="blue"
                as={Button}
                // rounded={'full'}
                variant={'outline'}
                cursor={'pointer'}
                minW={0}

                // pr="2"
                // pl="1"
              >Browse</MenuButton>
              <MenuList>               
                <MenuItem
                  onClick={() =>
                    navigate(`/popular/stable/1`)
                  }
                >Popular Art
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    navigate(`/recent/stable/1`)
                  }
                >Recent Art
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    navigate(`/recent/dream/1`)
                  }
                >Recent Dreams
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    navigate(`/recent/hallucination/1`)
                  }
                >Recent Hallucinations
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={() =>
                    navigate(`/random/stable/50`)
                  }
                >Random Art
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    navigate(`/random/dream/50`)
                  }
                >Random Dreams
                </MenuItem>
                {/*
                <MenuItem
                  onClick={() =>
                    (window.location.href = `/recent/stable/1`)
                  }
                >All Stable
                </MenuItem>
                 <MenuDivider />
                <MenuItem
                  onClick={() =>
                    (window.location.href = `/recent/disco/1`)
                  }
                >All Disco
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    (window.location.href = `/recent/general/1`)
                  }
                >General
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    (window.location.href = `/recent/portraits/1`)
                  }
                >Portraits
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    (window.location.href = `/recent/isometric/1`)
                  }
                >Isometric
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    (window.location.href = `/recent/pixel-art/1`)
                  }
                >Pixel Art
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    (window.location.href = `/recent/paint-pour/1`)
                  }
                >Paint and Pour
                </MenuItem> */}
                
              </MenuList>
              </Menu><Menu>
              {/* <Button variant={'outline'} colorScheme="green" onClick={() =>
                navigate(`/mutate/2c63a23fcfc693c67d5ff5767ace6dd954af52b743aa342dca52ac9d5d108752`)
              }>Create</Button> */}
              <MenuButton
                colorScheme="green"
                as={Button}
                // rounded={'full'}
                variant={'outline'}
                cursor={'pointer'}
                minW={0}
                // pr="2"
                // pl="1"
              >Create</MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() =>
                    (navigate(`/mutate/2c63a23fcfc693c67d5ff5767ace6dd954af52b743aa342dca52ac9d5d108752`))
                  }
                >Stable Diffusion
                </MenuItem>
                <MenuDivider />
                {/* <MenuItem
                  onClick={() =>
                    (window.location.href = `/mutate/default-lighthouse`)
                  }
                >Disco Diffusion
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    (window.location.href = `/mutate/default-portrait`)
                  }
                >Default Portrait
                </MenuItem> */}
                <MenuItem
                  onClick={() =>
                    navigate(`/dream`)
                  }
                >Dream
                </MenuItem>
                </MenuList>
            </Menu>
          <Flex marginLeft="auto" alignItems={'center'}>
            {/* <IconButton colorScheme={"purple"}
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
            /> */}
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
                  <Profile myInfo={myInfo} />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() =>
                      navigate(`/following/1`)
                    }
                  >Follow Feed
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      navigate(`/myfavs/1`)
                    }
                  >My Favorites
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      navigate(`/gallery/${
                        user.sub.split('|')[2]
                      }/1`)
                    }
                  >
                    My Gallery
                  </MenuItem>
                  {/* <MenuItem
                    onClick={() =>
                      (window.location.href = `/myuploads`)
                    }
                  >
                    My Uploads
                  </MenuItem> */}
                  <MenuItem
                    onClick={() =>
                      navigate(`/myjobs/all/1`)
                    }
                  >
                    My Jobs
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      navigate(`/myreviews/1`)
                    }
                  >
                    My Reviews {myInfo.reviews > 0 && `(${myInfo.reviews})`}
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      navigate(`/myprofile`)
                    }
                  >
                    My Profile
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onClick={() => navigate(`/agentstatus`)}
                  >
                    GPU Status
                  </MenuItem>
                  <MenuItem onClick={() => navigate(`/jobs`)}>
                    Job Queue
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                  onClick={() => navigate(`https://discord.gg/yNDqCnzCbs`)}
                  >
                    Discord
                  </MenuItem>
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
                  title={<Button colorScheme="blue">+ New Dream</Button>}
                  url="/dream"
                />
              )}
            </Stack>
          </Box>
        ) : null}
      </Box>
      {announcement && announcement.map(a=>{
        if (a.id > lastAck) return <Box m={5} mb={0} p={5} borderWidth={1} rounded={"md"}>
          <Text>
            {a.text}
          </Text>
          <Center>
            <Button size={"sm"} colorScheme={"green"} onClick={()=>{
              localStorage.setItem("lastAck",a.id)
              setLastAck(a.id)
            }}>Got it.</Button>
          </Center>
        </Box>
      })}
    </>
  );
}
