import React from 'react';
import { Link } from 'react-router-dom';
import { Text, Flex, Center, Button } from '@chakra-ui/react';
import { Icon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

/* Creates a back, forward, and page # button navigator. Some gallery views are paginated while others (e.g. random) are not */
const PaginationNav = ({ pageNumber, prevURL, nextURL }) => (
  <Center mt={4} mb={4} fontSize="lg">
    <Flex marginBottom={3} alignItems="center">
      <Link to={prevURL}>
        <Button variant="outline" colorScheme="blue">
          <ArrowBackIcon />
        </Button>
      </Link>
      <Text mr={3} ml={3}>
        {pageNumber}
      </Text>
      <Link to={nextURL}>
        <Button variant="outline" colorScheme="blue">
          <ArrowForwardIcon />
        </Button>
      </Link>
    </Flex>
  </Center>
);

export default PaginationNav;
