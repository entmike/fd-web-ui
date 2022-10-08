import React from 'react';
import { useState, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';
import { dt } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Text,
  Wrap,
  Badge,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  IconButton,
  useToast,
  Link
  // useClipboard
} from '@chakra-ui/react';
import { HelpHeader } from '../shared/HelpHeader';
import { BiCopy } from 'react-icons/bi';
import { GiConfirmed } from 'react-icons/gi';

export default function MyInvitesPage({isAuthenticated, token, user, myInfo}) {
  const toast = useToast()
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  // const [copyCode, setCopyCode] = useState(null);
  // const { hasCopied, onCopy } = useClipboard(copyCode);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiURL = `${process.env.REACT_APP_api_url}/v3/myinvites`;

  useEffect(() => {
    setLoading(true);
    let headers
    if (token) {
      headers = {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
      }
    }else{
      console.log("Not logged in")
    }
    fetch(apiURL,{headers})
      .then((response) => response.json())
      .then((actualData) => {
        setData(actualData);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, user, isAuthenticated,myInfo.invites]);

  // console.log('loading', loading);

  return (
    <>
      <HelpHeader
            title={`My Invites`}
            description={`On occasion, you may be airdropped some invites.  When you generate an invite code, you can send this invite code to a friend who can redeem it to generate images on Fever Dreams.  Invite codes are good for one user each.  By inviting someone to Fever Dreams means that you accept responsibility for the user's actions.  Make sure you invite people who you feel can follow the Terms of Service.`}/>
      {/* <Text>Invites remaining: <Badge>{myInfo.invites}</Badge></Text> */}
      <Button
        isLoading={loading}
        rounded={"full"}
        isDisabled={loading || myInfo.invites<1}
        colorScheme={'blue'}
        size="md"
        onClick={(e) => {
          let method = "POST"
          setLoading(true)
          fetch(
            `${process.env.REACT_APP_api_url}/generateinvite`,
            {
              method: method,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              }
            }
          ).then((response=>{
            setLoading(false)
            // toast({
            //   title: "Job Received",
            //   description: "5 more coming up",
            // })
          })).catch(err=>{
            setLoading(false)
          })
        }}><MdAdd />Create Invite ({myInfo.invites} left)</Button>
      <TableContainer>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th>Code</Th>
              <Th>Date</Th>
              <Th>Redeemed</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data && data.map(invite=>{
              return <Tr key={invite.invite_code}>
                <Td><Badge>{invite.invite_code}</Badge>
                <IconButton size="sm" onClick={(e=>{
                  navigator.clipboard.writeText(invite.invite_code)
                  toast({
                    title: "Invite Code copied",
                    description: "The invite code has been copied to your clipboard.",
                    status: "success"
                  })
                })} ml={2} icon={<BiCopy />}/>
                </Td>
                <Td>{dt(invite.timestamp)}</Td>
                <Td>{
                  invite.redeemed===undefined?"No":<>
                    <Link onClick={(e)=>{
                      console.log(invite)
                      navigate(`/gallery/${invite.userdets.user_id_str}/1`)
                      // e.stopPropagation()
                    }}>
                      <Wrap>
                        <Avatar size='sm' name={invite.userdets.display_name?invite.userdets.display_name:invite.userdets.nickname} src={invite.userdets.picture?invite.userdets.picture:invite.userdets.avatar}>
                        </Avatar><small style={{color:"#FFF", textShadow: "1px 1px 2px #2a2a2a"}}><strong>{invite.userdets.nickname?invite.userdets.nickname:invite.userdets.display_name}</strong><br/>
                        {dt(invite.redeemed_timestamp)}</small>
                      </Wrap>
                    </Link>
                  </>
                }</Td>
              </Tr>
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
