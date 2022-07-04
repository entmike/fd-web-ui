import { useAuth0 } from "@auth0/auth0-react";
import React from "react"
import { useState, useEffect } from "react";

import { Input, Text } from '@chakra-ui/react';

export function Dream() {
    // TODO: Complete or delete
    const [, setToken] = useState(true);
    const [dream, setDream] = useState(true);
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    useEffect(()=>{
        const getToken = async()=>{
          let token
          try{
            token = await getAccessTokenSilently({
              audience : "https://api.feverdreams.app/"
            })
            fetch("https://api.feverdreams.app/web/dream", {
              headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              }
            }).then(response=>{
              return response.json()
            }).then(data=>{
              console.log(data)
              setDream(data)
              return data
            })
            setToken(token)
          }catch(e){
            console.log("Not logged in")
          }
        }
        const getDream = async()=>{
            setDream("testing...")
        }
        getToken()
        getDream()
      },[getAccessTokenSilently, user?.sub])
    return (<>
        {isAuthenticated &&
            <>
            <Text>Dream Count {dream.count}</Text>
            <Input placeholder='Your dream here...' defaultValue={dream.dream} />
            </>
        }
    </>);
}