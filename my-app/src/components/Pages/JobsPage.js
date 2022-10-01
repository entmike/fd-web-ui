import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HelpHeader } from '../shared/HelpHeader';
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
  const params = useParams();
  let pType = params.type
  if(!pType) pType = "processing"
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
    processing: d,
    queued: w,
  });
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(pType);

  function fetchStatus() {
    setLoading(true);
    fetch(`${process.env.REACT_APP_api_url}/v3/public_queue/${type}`)
      .then((response) => {
        return response.json();
      })
      .then((actualData) => {
        let updatedData = JSON.parse(JSON.stringify(data))
        updatedData[type] = actualData
        setData({ ...data, ...updatedData });
        setLoading(false)
      });
  }

  // https://exerror.com/react-hook-useeffect-has-a-missing-dependency/
  useEffect((type) => {
    fetchStatus(type);
  }, [type]);
  return (
    <>
     <HelpHeader
        title={`Job Status`}
        description={`Active and waiting job details`}/>
      
      <Tabs mt={5} variant="soft-rounded" colorScheme="blue" index={type==="processing"?0:1} onChange={index=>{
          if(index===0) setType("processing")
          if(index===1) setType("queued")
        }}>
        <TabList>
          <Tab>Processing</Tab>
          <Tab>Queued</Tab>
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
                    <Th>Agent/Resolution</Th>
                    <Th>Models</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data.processing.map((o, i) => {
                      let prompt = "Unknown Prompt"
                      if (o.algo==="stable"){
                        prompt = o.prompt   // TODO: Params
                      }
                      if (o.algo==="disco"){
                        prompt = o.text_prompts
                      }
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
                                  <Badge variant={"subtle"} colorScheme={"blue"} ml={5}>{o && o.algo?o.algo:"Unknown"}</Badge><br/>
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
                                <Code>{o && o.agent_id?o.agent_id:"Unknown"}</Code><br/>
                                {/* <Badge variant={"subtle"} colorScheme={"blue"} ml={5}>{o && o.gpu_preference?o.gpu_preference:"Unknown"}</Badge> */}
                                <Badge variant={"outline"}>{o && o.width_height?`${o.width_height[0]} x ${o.width_height[1]}`:"Unknown"}</Badge>
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
                    <Th>Resolution</Th>
                    <Th>Models</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data.queued.map((o, i) => {
                      let prompt = "Unknown Prompt"
                      if (o.algo==="stable"){
                        if (o.params)
                          prompt = o.params.prompt   // TODO: Params
                      }
                      if (o.algo==="disco"){
                        prompt = o.text_prompts
                      }
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
                                  <Badge variant={"subtle"} colorScheme={"blue"} ml={5}>{o && o.algo?o.algo:"Unknown"}</Badge><br/>
                                </>
                              </Link>
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                              {o.timestamp?dt(o.timestamp):"?"}
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                              <>
                                <Text w={400} noOfLines={4} wordBreak={"break-all"}>{prompt}</Text>
                              </>
                            </Skeleton>
                          </Td>
                          <Td>
                            <Skeleton isLoaded={!loading}>
                              <Badge variant={"outline"}>{o && o.width_height?`${o.width_height[0]} x ${o.width_height[1]}`:"Unknown"}</Badge>
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
