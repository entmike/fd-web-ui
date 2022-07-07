import React from 'react';
import { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Tab,
  TabPanel,
  Tabs,
  TabList,
  TabPanels,
  Link,
  Image,
  Skeleton,
} from '@chakra-ui/react';
import { dt } from '../utils/dateUtils';
import { DreamAuthor } from './shared/DreamAuthor';

export function Jobs() {
  let d = [];
  for (let i = 0; i < 25; i++)
    d.push({
      render_type: 'render',
      timestamp: 'January 1, 1900',
      uuid: `xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx${i}`,
      userdets: {},
      model: 'default',
      percent: '50%',
    });
  let w = JSON.parse(JSON.stringify(d));

  const [data, setData] = useState({
    active: d,
    waiting: w,
  });
  const [loading, setLoading] = useState(true);

  function fetchStatus(type, amount, user_id) {
    setLoading(true);

    let active = fetch(`https://api.feverdreams.app/web/queue/processing/`)
      .then((response) => {
        return response.json();
      })
      .then((actualData) => {
        return actualData;
      });

    let queued = fetch(`https://api.feverdreams.app/web/queue/queued/`)
      .then((response) => {
        return response.json();
      })
      .then((actualData) => {
        return actualData;
      });

    Promise.all([active, queued]).then((data) => {
      console.log(data);
      setData({
        active: data[0],
        waiting: data[1],
      });
      setLoading(false);
    });
  }

  // https://exerror.com/react-hook-useeffect-has-a-missing-dependency/
  useEffect(() => {
    fetchStatus();
  }, []);
  return (
    <>
      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList>
          <Tab>Active</Tab>
          <Tab>Waiting</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TableContainer>
              <Table variant="simple">
                <TableCaption>List of active jobs</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Author</Th>
                    <Th>Job UUID</Th>
                    <Th>Image</Th>
                    <Th width={`75px`}>Timestamp</Th>
                    <Th>Render Type</Th>
                    <Th>Model Mode</Th>
                    <Th>Progress %</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data.active.map((o, i) => {
                      return (
                        <Tr key={o.uuid}>
                          <Th>
                            <Skeleton isLoaded={!loading}>
                              <DreamAuthor userdets={o.userdets} />
                            </Skeleton>
                          </Th>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                              <Link color="green.500" href={`/piece/${o.uuid}`}>
                                {o.uuid}
                              </Link>
                            </Skeleton>
                          </Td>
                          <Td width={`75px`}>
                            <Link color="green.500" href={`/piece/${o.uuid}`}>
                              <Skeleton isLoaded={!loading}>
                                <Image
                                  borderRadius="lg"
                                  src={`https://api.feverdreams.app/thumbnail/${o.uuid}/64`}
                                  // alt={o.text_prompt}
                                  objectFit="cover"
                                />
                              </Skeleton>
                            </Link>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                              {dt(o.timestamp)}
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                              {o.render_type}
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>{o.model}</Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>{o.percent}</Skeleton>
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <TableContainer>
              <Table variant="simple">
                <TableCaption>List of waiting jobs</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Author</Th>
                    <Th>Job UUID</Th>
                    <Th width={`75px`}>Timestamp</Th>
                    <Th>Render Type</Th>
                    <Th>Model Mode</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data.waiting.map((o, i) => {
                      // let gpustats = o.gpustats.split(", ")
                      return (
                        <Tr key={o.uuid}>
                          <Th>
                            <Skeleton isLoaded={!loading}>
                              <DreamAuthor userdets={o.userdets} />
                            </Skeleton>
                          </Th>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                              <Link color="green.500" href={`/piece/${o.uuid}`}>
                                {o.uuid}
                              </Link>
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                              {dt(o.timestamp)}
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                              {o.render_type}
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>{o.model}</Skeleton>
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
