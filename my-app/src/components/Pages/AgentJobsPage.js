import React from 'react';
import { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import {
  Badge,
  Heading,
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
  Button,
} from '@chakra-ui/react';
import { dt } from '../../utils/dateUtils';
import PaginationNav from '../shared/Feed/PaginationNav';

function AgentJobsPage() {
    const params = useParams();
    let d = [];
    const prevURL = `/agentstatus/${params.agent}/${parseInt(params.page) - 1}`;
    const nextURL = `/agentstatus/${params.agent}/${parseInt(params.page) + 1}`;
    const apiURL = `${process.env.REACT_APP_api_url}/web/agentjobs/${params.agent}/${params.page}`
  for (let i = 0; i < 25; i++)
    d.push({
      render_type: 'render',
      timestamp: 'January 1, 1900',
      uuid: `xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx${i}`,
      model: [],
      percent: '50%',
    });

  const [data, setData] = useState({
    jobs: d
  });
  const [loading, setLoading] = useState(true);

  function fetchJobs() {
    setLoading(true);
    let active = fetch(apiURL,
    // {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`,
    //     }
    // }
    )
      .then((response) => {
        return response.json();
      })
      .then((actualData) => {
        return actualData;
      });

    Promise.all([active]).then((data) => {
      setData({
        jobs: data[0]
      });
      setLoading(false);
    });
  }

  // https://exerror.com/react-hook-useeffect-has-a-missing-dependency/
  useEffect(() => {
    fetchJobs();
  }, [params.page, params.agent]);
  return (
    <>
        <Heading>{params.agent}</Heading>
        <PaginationNav
            pageNumber={params.page}
            prevURL={prevURL}
            nextURL={nextURL}
        />
        <TableContainer>
            <Table variant="simple">
            <TableCaption>List of your jobs</TableCaption>
            <Thead>
                <Tr>
                    <Th>Job</Th>
                    <Th>Status</Th>
                    <Th>User</Th>
                    <Th>Timestamp</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data &&
                data.jobs.map((o, i) => {
                    return (
                    <Tr key={o.uuid}>
                        <Td>
                        <Skeleton isLoaded={!loading}>
                            <Link color="green.500" href={`/piece/${o.uuid}`} target="_blank">
                            <Code>{o.uuid}</Code>
                            </Link>
                        </Skeleton>
                        </Td>
                        <Td>
                        <Skeleton isLoaded={!loading}>
                            <Badge variant="outline" colorScheme={
                                (o.status==="archived" || o.status==="complete")?"green":
                                (o.status==="rejected" || o.status==="failed")?"red":
                                (o.status==="queued" || o.status==="processing")?"blue":""
                            }>{o.status}</Badge>
                        </Skeleton>
                        </Td>
                        <Td>
                            <Skeleton isLoaded={!loading}>
                                {o.author}
                            </Skeleton>
                        </Td>
                        <Td>
                        <Skeleton isLoaded={!loading}>
                            {dt(o.timestamp)}
                        </Skeleton>
                        </Td>
                    </Tr>
                    );
                })}
            </Tbody>
            </Table>
        </TableContainer>
        <PaginationNav
            pageNumber={params.page}
            prevURL={prevURL}
            nextURL={nextURL}
        />
    </>
  );
}

export default AgentJobsPage;
