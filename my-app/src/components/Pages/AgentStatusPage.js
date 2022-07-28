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
  HStack
} from '@chakra-ui/react';
import { dt } from '../../utils/dateUtils';

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
    let url = `https://api.feverdreams.app/agentstats`;
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
              <Th>Agent ID</Th>
              <Th>Version</Th>
              <Th>Last Seen</Th>
              <Th>Mode</Th>
              <Th>Score</Th>
              {/* <Th>GPU</Th> */}
              <Th>VRAM</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.map((o, i) => {
                console.log(o);
                // let gpustats = o.gpustats.split(', ');
                let vram = (o.gpu && o.gpu.mem_total)?o.gpu.mem_total:"???"

                return (
                  <Tr key={o.agent_id}>
                    <Td>
                      <Skeleton isLoaded={!loading}>{o.agent_id}</Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}><Code>{o.bot_version}</Code></Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>{dt(o.last_seen)}</Skeleton>
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
                    <Td>
                      <Skeleton isLoaded={!loading}>{vram}</Skeleton>
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
