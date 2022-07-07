import React from "react"
import { useState, useEffect } from "react";
import { Button, Input, Skeleton, Text } from '@chakra-ui/react';

// TODO: This isAuthenticated/token stuff should be in a context
export function Dream({isAuthenticated,token}) {
    const [dream, setDream] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dreamPrompt, setDreamPrompt] = useState('');

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
          return data
        })
        console.log('SUCCESS:', dreamSuccess)

        // TODO: I can't do this at the moment for w/e reason. May want to send dream back instead of success?
        // if (dreamSuccess) getDream();
      } catch (error) {
        console.log('Unable to induce dream state')
      }
    }

    // TODO: This would be useful...:w

    // function handleWakeUp() {
    //   // fetch(`https://api.feverdreams.app/web/awaken/${}`)
    // }

    return (<>
      {isAuthenticated ?
        <Skeleton isLoaded={!loading}>
          <Text>
            Dream Count: {dream ? dream.count : 'not currently dreaming'}
          </Text>
          <Input
            placeholder='Your dream here...'
            value={dreamPrompt}
            onChange={(event) => setDreamPrompt(event.target.value)}
          />
          <Button onClick={handleInitiateDream}>Dream</Button>
          {/* <Button onClick={handleWakeUp} disabled={!dream}>Wake Up</Button> */}
        </Skeleton>
      :
        <Text>Try logging in, first.</Text>
      }
    </>);
}