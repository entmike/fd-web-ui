import { useState, useEffect } from 'react';
import { Box, Heading, Wrap, Center, IconButton, Text, Button, VStack } from '@chakra-ui/react';
import { BiHelpCircle } from 'react-icons/bi';
export function HelpHeader(props) {
    const [showHelp, setShowHelp] = useState(false);
    useEffect(() => {
        
    }, []);

    return(
        <>
        <Wrap><Heading>{props.title}</Heading>
        <IconButton isRound variant={"ghost"} icon={<BiHelpCircle/>} onClick={()=>{setShowHelp(!showHelp)}}/>
        </Wrap>
        {showHelp && <Box mt={5} borderWidth={1} p={5} borderRadius="md"><Text>{props.description}</Text>
        <Button size={"sm"} colorScheme={"green"} onClick={()=>{
              setShowHelp(false)
            }}><Center>Got it.</Center></Button>
        </Box>}
        </>
    )
}