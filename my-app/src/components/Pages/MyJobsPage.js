import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  RadioGroup,
  Radio

} from '@chakra-ui/react';
import { dt } from '../../utils/dateUtils';
import PaginationNav from '../shared/Feed/PaginationNav';

function MyJobsPage({ isAuthenticated, token }) {
    const params = useParams();
    let navigate = useNavigate();
    const { user } = useAuth0();
    let d = [];
    const prevURL = `/myjobs/${params.status}/${parseInt(params.page) - 1}`;
    const nextURL = `/myjobs/${params.status}/${parseInt(params.page) + 1}`;
    const apiURL = `${process.env.REACT_APP_api_url}/v3/myjobs/${params.status}/${params.page}`
  for (let i = 0; i < 25; i++)
    d.push({
      render_type: 'render',
      timestamp: 'January 1, 1900',
      uuid: `xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx${i}`,
      userdets: {},
      model: [],
      percent: '50%',
    });

  const [data, setData] = useState({
    jobs: d
  });
  const [loading, setLoading] = useState(true);

  function fetchJobs() {
    setLoading(true);

    let active = fetch(apiURL,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      }
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
  }, [params.page, params.status]);
  return (
    isAuthenticated?<>
        <FormControl>
          <FormLabel htmlFor="status">Job Status</FormLabel>
          <RadioGroup
            value={params.status}
            onChange={(value) => {
              navigate(`/myjobs/${value}/${parseInt(params.page)}`)
            }}
          >
            <Radio mr={5} value="all">All</Radio>
            <Radio mr={5} value="failed">Failed</Radio>
            <Radio mr={5} value="queued">Queued</Radio>
          </RadioGroup>
          <FormHelperText>
            Filter by job type
          </FormHelperText>
        </FormControl>
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
                    <Th>Options</Th>
                    <Th>Agent</Th>
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
                            <Button size={"sm"} colorScheme={"green"} onClick={() => {
                                navigate(`/piece/${o.uuid}`)
                            }}>Details</Button>
                                {(o.status==="rejected" || o.status==="failed") && <Button size={"sm"} isDisabled={!(o.status==="rejected" || o.status==="failed")} colorScheme={"blue"} onClick={() => {
                                    fetch(
                                        `${process.env.REACT_APP_api_url}/v3/retry`,
                                        {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({ uuid: o.uuid }),
                                        }
                                    ).then((response) => {
                                        return response.json();
                                      })
                                      .then((data) => {
                                        fetchJobs();
                                        return data;
                                      });
                                    }}>Retry</Button>}
                                {(o.status==="rejected" || o.status==="failed" || o.status==="queued") && <Button size={"sm"} colorScheme={"blue"} onClick={()=>{
                                  navigate(`/edit/${o.uuid}`)
                                }}>Edit</Button>}
                                {(o.status==="rejected" || o.status==="failed" || o.status==="queued") && <Button size={"sm"} colorScheme={"red"} onClick={() => {
                                    fetch(
                                        `${process.env.REACT_APP_api_url}/v3/cancel`,
                                        {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({ uuid: o.uuid }),
                                        }
                                    ).then((response) => {
                                        return response.json();
                                      })
                                      .then((data) => {
                                        fetchJobs();
                                        return data;
                                      });
                                    }}>Cancel</Button>}
                            </Skeleton>
                        </Td>
                        <Td>
                            <Skeleton isLoaded={!loading}>
                              <Link onClick={()=>{
                                  navigate(`/agentstatus/${o.agent_id}/1`)
                                }}> {o.status!=="queued" &&
                                  <Code>{o && o.agent_id?o.agent_id:"Unknown"}</Code>
                                }
                                </Link>
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
    </>:<Text>To see your jobs, log in.</Text>
  );
}

export default MyJobsPage;
