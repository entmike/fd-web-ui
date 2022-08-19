import React from 'react';
import { useState, useEffect } from 'react';
import {
  Badge,
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
  Text,
  Link,
  Image,
  Code,
  Skeleton,
  Center,
} from '@chakra-ui/react';
import { dt } from '../../utils/dateUtils';
import { DreamAuthor } from '../shared/DreamAuthor';
import { CopyButton } from '../shared/CopyButton';

function JobsPage() {
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

    let queued = fetch(`https://api.feverdreams.app/web/up_next`)
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
              <Table>
                <TableCaption>List of active jobs</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Author</Th>
                    <Th>Job</Th>
                    <Th>Agent/GPU Size</Th>
                    <Th>Models</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data.active.map((o, i) => {
                      return (
                        <Tr key={o.uuid}>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                                <DreamAuthor userdets={o.userdets} />
                                <Text>{o && o.userdets?o.userdets.nickname:"Unknown"}</Text>
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                              <Link color="green.500" href={`/piece/${o.uuid}`} target="_blank">
                                <>
                                  <Code>{o.uuid}</Code>
                                  <Badge variant={"subtle"} colorScheme={"blue"} ml={5}>{o && o.render_type?o.render_type:"Unknown"}</Badge><br/>
                                </>
                              </Link>
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                              {dt(o.timestamp)}
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                              <>
                                <Text w={400} noOfLines={4} wordBreak={"break-all"}>{o.text_prompts?o.text_prompts:o.text_prompt}</Text>
                                {/* {o.text_prompts?o.text_prompts:o.text_prompt} */}
                              </>
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                              <>
                                <Text>Processing Time: {o.processingTime?(o.processingTime/1000):""}</Text>
                              </>
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                              <>
                                <Code>{o && o.agent_id?o.agent_id:"Unknown"}</Code>
                                <Badge variant={"subtle"} colorScheme={"blue"} ml={5}>{o && o.gpu_preference?o.gpu_preference:"Unknown"}</Badge>
                              </>
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>{
                              <>
                                <Badge variant={"outline"} colorScheme={"green"}>{o.diffusion_model}</Badge><br/>
                                {o.clip_models && o.clip_models.map(clip_model=>{
                                  return <><Badge variant={"outline"}>{clip_model}</Badge><br/></>
                                })}
                              </>}</Skeleton>
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
                    <Th>Job</Th>
                    <Th>GPU Size</Th>
                    <Th>Models</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data.waiting.map((o, i) => {
                      // let gpustats = o.gpustats.split(", ")
                      return (
                        <Tr key={o.uuid}>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                                <DreamAuthor userdets={o.userdets} />
                                <Text>{o && o.userdets?o.userdets.nickname:"Unknown"}</Text>
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                              <Link color="green.500" href={`/piece/${o.uuid}`} target="_blank">
                                <>
                                  <Code>{o.uuid}</Code>
                                  <Badge variant={"subtle"} colorScheme={"blue"} ml={5}>{o && o.render_type?o.render_type:"Unknown"}</Badge><br/>
                                </>
                              </Link>
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                              {o.timestamp?dt(o.timestamp):"?"}
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                              <>
                                <Text w={400} noOfLines={4} wordBreak={"break-all"}>{o.text_prompts?o.text_prompts:o.text_prompt}</Text>
                                {/* {o.text_prompts?o.text_prompts:o.text_prompt} */}
                              </>
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                              <Badge variant={"outline"}>{o && o.gpu_preference?o.gpu_preference:"Unknown"}</Badge>
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>{
                              <>
                                <Badge variant={"outline"} colorScheme={"green"}>{o.diffusion_model}</Badge><br/>
                                {o.clip_models && o.clip_models.map(clip_model=>{
                                  return <><Badge variant={"outline"}>{clip_model}</Badge><br/></>
                                })}
                              </>}</Skeleton>
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

export default JobsPage;
