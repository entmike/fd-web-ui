import React from "react"
import { useState, useEffect } from "react";
import { Button, Input, Skeleton, Text, Textarea } from '@chakra-ui/react';
import { useAuth0 } from "@auth0/auth0-react";

// TODO: This isAuthenticated/token stuff should be in a context <- Agreed, -Mike.
export function Dream({isAuthenticated,token}) {
    const [dream, setDream] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dreamPrompt, setDreamPrompt] = useState('');
    const { user } = useAuth0();
    async function getDream(token) {
      setLoading(true)

      try {
        const dreamData = await fetch("https://api.feverdreams.app/web/dream", {
          headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }).then(response=>{
          return response.json()
        }).then(data=>{
          return data
        })

        if (dreamData) {
          setDream(dreamData)
          setDreamPrompt(dreamData.dream)
        }

        setLoading(false)

      } catch (error) {
        console.log('Unable to catch dreams...')
      }
    }

    useEffect(()=>{
      // TODO: They probably shouldn't even be able to get to this /dream route without being authenticated first
      if (isAuthenticated){
         getDream(token)
      }else{
        console.log("Not Authenticated.")
      }
    },[isAuthenticated,token])

    async function handleInitiateDream() {
      try {
        const { success: dreamSuccess } = await fetch("https://api.feverdreams.app/web/dream", {
          method: 'POST',
          headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ dream: dreamPrompt})
        }).then(response=>{
          return response.json()
        }).then(data=>{
          // Simulate data return -mike
          setDream({
            count : 0,
            dream:dreamPrompt
          })
        })
        console.log('SUCCESS:', dreamSuccess)

        // TODO: I can't do this at the moment for w/e reason. May want to send dream back instead of success?
        // if (dreamSuccess) getDream();
      } catch (error) {
        console.log('Unable to induce dream state')
      }
    }

    function handleWakeUp() {
      fetch(`https://api.feverdreams.app/awaken/${user.sub.split('|')[2]}`).then(response=>{setDream(null);setDreamPrompt('')})
    }

    return (<>
      {isAuthenticated ?
        <Skeleton isLoaded={!loading}>
          <Text>
            Dream Count: {dream ? dream.count : 'not currently dreaming'}
          </Text>
          <Textarea
            placeholder='Your dream here...'
            value={dreamPrompt}
            onChange={(event) => setDreamPrompt(event.target.value)}
          />
          <Button onClick={handleInitiateDream}>Dream</Button>
          <Button onClick={handleWakeUp} disabled={!dream}>Wake Up</Button>
        </Skeleton>
      :
        <Text>Try logging in, first.</Text>
      }
    </>);
}