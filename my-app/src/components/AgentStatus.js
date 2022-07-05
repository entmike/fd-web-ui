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
  } from '@chakra-ui/react'
import { dt } from '../utils/dateUtils'
  
export function AgentStatus() {
    const [data, setData] = useState(false);
    // TODO: Complete or delete
    const [loading, setLoading] = useState(true);
    
    function fetchStatus(type, amount, user_id) {
        let url = `https://api.feverdreams.app/agentstats`
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
                <TableCaption>List of active agents running</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Agent ID</Th>
                        <Th>Last Seen</Th>
                        <Th>Mode</Th>
                        <Th>Model Mode</Th>
                        <Th>Score</Th>
                        <Th>GPU</Th>
                        <Th>Temp.</Th>
                        <Th>GPU Util %</Th>
                        <Th>VRAM Util %</Th>
                        <Th>VRAM</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data && data.map((o, i)=>{
                        console.log(o)
                        let gpustats = o.gpustats.split(", ")

                        return <Tr key={o.agent_id}>
                                <Td>{o.agent_id}</Td>
                                <Td>{dt(o.last_seen)}</Td>
                                <Td>{
                                  (()=>{
                                    switch(o.mode){
                                      case "dreaming":
                                        return "🌜"
                                      case "working":
                                        return "⚒️"
                                      case "awake":
                                        return "👀"
                                      default:
                                        return o.mode
                                    }
                                  })()
                                }</Td>
                                <Td>{o.model_mode}</Td>
                                <Td>{o.score}</Td>
                                <Td>{gpustats[0]}</Td>
                                <Td>{gpustats[1]}</Td>
                                <Td>{gpustats[2]}</Td>
                                <Td>{gpustats[3]}</Td>
                                <Td>{gpustats[4]}</Td>
                            </Tr>
                    })
                    }
                </Tbody>
            </Table>
        </TableContainer>
    </>
}