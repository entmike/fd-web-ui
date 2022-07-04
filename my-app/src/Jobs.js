import React from "react"
import { useState, useEffect } from "react";
import DreamAuthor from "./DreamAuthor";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Link, Image
  } from '@chakra-ui/react'
  
export default function Jobs() {
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(true);
    
    function dt(ts){
        let s = ""
        if (ts && ts["$date"]){
            s = ts.$date.toString()
        }else{
            s = new Date(ts).toString()
        }
        console.log(s)
        return s
    }
    function fetchStatus(type, amount, user_id) {
        let url = `https://api.feverdreams.app/web/queue/processing/`
        fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((actualData) => {
          console.log(actualData)
          setData(actualData);
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
                        console.log(o)
                        // let gpustats = o.gpustats.split(", ")

                        return <Tr key={o.uuid}>
                                <Th><DreamAuthor userdets={o.userdets}/></Th>
                                <Td><Link color='green.500' href={`/piece/${o.uuid}`}>{o.uuid}</Link></Td>
                                <Td width={`75px`}><Link color='green.500' href={`/piece/${o.uuid}`}>
                                        <Image
                                        borderRadius="lg"
                                        src={`https://api.feverdreams.app/thumbnail/${o.uuid}/64`}
                                        // alt={o.text_prompt}
                                        objectFit="cover"
                                    />
                                </Link></Td>
                                <Td>{dt(o.timestamp)}</Td>
                                <Td>{o.render_type}</Td>
                                <Td>{o.model}</Td>
                                <Td>{o.percent}</Td>
                            </Tr>
                    })
                    }
                </Tbody>
            </Table>
        </TableContainer>
    </>
}