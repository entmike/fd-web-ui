import React from "react"
import { useState, useEffect } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Link, Image, Skeleton
  } from '@chakra-ui/react'
import { dt } from '../utils/dateUtils'
import { DreamAuthor } from "./shared/DreamAuthor";
  
export function Jobs() {
    let d = []
    for(let i=0;i<25;i++) d.push({render_type: "render", timestamp: "January 1, 1900", uuid:`xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx${i}`, userdets:{}, model: "default", percent:"50%"})
    const [data, setData] = useState(d);
    const [loading, setLoading] = useState(true);
    
    function fetchStatus(type, amount, user_id) {
        setLoading(true)
        let url = `https://api.feverdreams.app/web/queue/processing/`
        fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((actualData) => {
          console.log(actualData)
          setData(actualData);
          console.log(loading)
          setLoading(false);
        })
        .then(() => {
          setLoading(false);
        });
      }
      
      // https://exerror.com/react-hook-useeffect-has-a-missing-dependency/
      useEffect(() => {
        fetchStatus()
      },[ ]);
    return <>
        <TableContainer>
            <Table variant='simple'>
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
                    {data && data.map((o, i)=>{
                        // let gpustats = o.gpustats.split(", ")
                        return <Tr key={o.uuid}>
                                <Th><Skeleton isLoaded={!loading}><DreamAuthor userdets={o.userdets}/></Skeleton></Th>
                                <Td><Skeleton isLoaded={!loading}><Link color='green.500' href={`/piece/${o.uuid}`}>{o.uuid}</Link></Skeleton></Td>
                                <Td width={`75px`}><Link color='green.500' href={`/piece/${o.uuid}`}>
                                    <Skeleton isLoaded={!loading}><Image
                                        borderRadius="lg"
                                        src={`https://api.feverdreams.app/thumbnail/${o.uuid}/64`}
                                        // alt={o.text_prompt}
                                        objectFit="cover"
                                    /></Skeleton>
                                </Link></Td>
                                <Td><Skeleton isLoaded={!loading}>{dt(o.timestamp)}</Skeleton></Td>
                                <Td><Skeleton isLoaded={!loading}>{o.render_type}</Skeleton></Td>
                                <Td><Skeleton isLoaded={!loading}>{o.model}</Skeleton></Td>
                                <Td><Skeleton isLoaded={!loading}>{o.percent}</Skeleton></Td>
                            </Tr>
                    })
                    }
                </Tbody>
            </Table>
        </TableContainer>
    </>
}