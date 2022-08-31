import React from 'react';
import { useState, useEffect } from 'react';
import {
  Table,
  Code,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Skeleton,
  Badge,
  HStack,
  Link
} from '@chakra-ui/react';
import { dt } from '../../utils/dateUtils';
import { Link as RouteLink } from 'react-router-dom';

function AgentStatusPage() {
  let d = [];
  for (var i = 0; i < 25; i++) {
    d.push({
      agent_id: `entmike-runpod-a6000-${i}`,
      last_seen: {
        $date: '2022-07-06T01:17:31.392Z',
      },
      mode: 'dreaming',
      idle_time: 35,
      score: 1919,
      model_mode: 'rn50x64',
      gpustats: 'NVIDIA RTX A6000, 83, 0, 0, 28399\n',
    });
  }
  const [data, setData] = useState(d);
  // TODO: Complete or delete
  const [loading, setLoading] = useState(true);

  function fetchStatus(type, amount, user_id) {
    let url = `${process.env.REACT_APP_api_url}/agentstats`;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((actualData) => {
        console.log(actualData);
        setData(actualData);
      })
      .then(() => {
        setLoading(false);
      });
  }

  // https://exerror.com/react-hook-useeffect-has-a-missing-dependency/
  useEffect(() => {
    fetchStatus();
  }, []);
  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>List of active agents running</TableCaption>
          <Thead>
            <Tr>
              <Th>Agent</Th>
              <Th>Specs</Th>
              <Th>Storage</Th>
              <Th>Memory</Th>
              <Th>Last Seen</Th>
              <Th>Pending Command</Th>
              <Th>Mode</Th>
              <Th>Score</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.map((o, i) => {
                console.log(o);
                // let gpustats = o.gpustats.split(', ');
                let vram = (o.gpu && o.gpu.mem_total)?o.gpu.mem_total:"???"
                let temperature = (o.gpu && o.gpu.temperature)?o.gpu.temperature:"???"
                return (
                  <Tr key={o.agent_id}>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        <RouteLink to={`/agentstatus/${o.agent_id}/1`}><Link color={"green.500"}>{o.agent_id}</Link></RouteLink><br/>
                        <Badge>{o.bot_version}</Badge><Badge ml={"5"}>{o.agent_discoart_version}</Badge><br/>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        <Badge variant={"outline"} color={"green.500"}>{o.gpu && o.gpu.name}</Badge><br/>
                        <Code>{Math.ceil(vram/1024)} GB VRAM</Code> | <Code>{Math.ceil(temperature)}C</Code>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        Free: <Code>{Math.ceil(o.free_space/1024/1024/1024)} GB</Code><br />
                        Used: <Code>{Math.ceil(o.used_space/1024/1024/1024)} GB</Code><br />
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        {o.memory && <>
                        Free: <Code>{Math.ceil(o.memory.free/1024/1024)} GB</Code><br />
                        Used: <Code>{Math.ceil(o.memory.used/1024/1024)} GB</Code><br />
                        Total: <Code>{Math.ceil(o.memory.total/1024/1024)} GB</Code><br />
                        </>}
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>{dt(o.last_seen)}</Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>{o.command}</Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        {(() => {
                          switch (o.mode) {
                            case 'dreaming':
                              return '🌜';
                            case 'working':
                              return '⚒️';
                            case 'awake':
                              return '👀';
                            default:
                              return o.mode;
                          }
                        })()}
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        {o.score}
                      </Skeleton>
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default AgentStatusPage;
