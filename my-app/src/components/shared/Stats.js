import {
    Box,
    chakra,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Center
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import { ReactNode } from 'react';
  import { BsCardImage, BsPerson, BsCpuFill } from 'react-icons/bs';
      
  function StatsCard(props) {
    const { title, stat, icon } = props;   
    return (
      <Stat
        px={{ base: 2, md: 4 }}
        py={'5'}
        shadow={'xl'}
        border={'1px solid'}
        borderColor={useColorModeValue('gray.800', 'gray.500')}
        rounded={'md'}>
        <Flex justifyContent={'space-between'}>
          <Box pl={{ base: 2, md: 4 }}>
            <StatLabel fontWeight={'medium'} isTruncated>{title}</StatLabel>
            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
              {stat}
            </StatNumber>
          </Box>
          <Box
            my={'auto'}
            color={useColorModeValue('gray.800', 'gray.200')}
            alignContent={'center'}>
            {icon}
          </Box>
        </Flex>
      </Stat>
    );
  }
  
  export function Stats() {
    const [data, setData] = useState(null);
    const [, setError] = useState(null);
    const [, setLoading] = useState(true);
    function fetchStats(amount) {
      let url = `https://api.feverdreams.app/landingstats`;
      console.log(url);
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((actualData) => {
          setData(actualData);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
          setData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    useEffect(() => {
      fetchStats();
    }, []);
    return (
      data && <Center>
        <Box minW={{ xl : "7xl", lg:"5xl"}} maxW={{ xl : "7xl", lg:"5xl"}} mx={'auto'} pt={5} px={{ base: 12, sm: 12, md: 17 }}>
          <chakra.h1
            textAlign={'center'}
            fontSize={'2xl'}
            py={10}
            fontWeight={'bold'}>
            Create and Browse generative AI art created openly by other users.
          </chakra.h1>
          <SimpleGrid columns={{ base: 1, md: 3, lg: 3 }} spacing={{ base: 5, lg: 5 }}>
            <StatsCard
              title={'Users'}
              stat={data.userCount}
              icon={<BsPerson size={'3em'} />}
            />
            <StatsCard
              title={'GPUs Online'}
              stat={data.agentCount}
              icon={<BsCpuFill size={'3em'} />}
            />
            <StatsCard
              title={'Images Generated'}
              stat={data.completedCount.toLocaleString('en-US')}
              icon={<BsCardImage size={'3em'} />}
            />
          </SimpleGrid>
        </Box>
      </Center>
    );
  }