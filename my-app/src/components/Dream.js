import React from "react"
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Input, Skeleton, Text } from '@chakra-ui/react';

export function Dream({isAuthenticated,token}) {
    const [dream, setDream] = useState("");
    const [loading, setLoading] = useState(true);

    const getDream = async(isAuthenticated, token)=>{
      console.log(isAuthenticated)
      console.log(token)
      if(isAuthenticated){
        setLoading(true)
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
          setLoading(false)
          return data
        })
      }else{
        console.log("Not Authenticated.")
      }
    }
    useEffect(()=>{
        getDream(isAuthenticated, token)
      },[isAuthenticated,token])
    return (<>
        {isAuthenticated &&
          <>
          <Skeleton isLoaded={!loading}>
            <Text>Dream Count {dream.count}</Text>
            <Input placeholder='Your dream here...' defaultValue={dream.dream} />
          </Skeleton>
          </>
        }
        {(isAuthenticated===false) &&
            <Text>Try logging in, first.</Text>
        }
    </>);
}