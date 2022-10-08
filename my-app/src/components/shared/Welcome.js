import { useState, useEffect } from 'react';
import { HelpHeader } from './HelpHeader';
import { dt } from '../../utils/dateUtils';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Wrap, Center, IconButton, Text, Button, ButtonGroup, VStack, Link, Input, SimpleGrid, useToast } from '@chakra-ui/react';
// import { Link } from 'react-router-dom';
export function Welcome(props) {
    const navigate = useNavigate()
    const toast = useToast()
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        
    }, []);

    return(
        <Box mt={5} mb={5} borderWidth={1} p={5} borderRadius="md">
            <Text mb={5}>Welcome to Fever Dreams!  You can now Follow users and Like images.  Due to growing site popularity, we need to make sure that you are a decent human being first before allowing you to generate any art.</Text>
                <Text mb={5} fontWeight={"bold"}>Have an Invite Code?</Text>
                <SimpleGrid columns={{sm: 1, md: 2, lg: 2}} spacing={10}>
                    <Box>
                        <Text mb={3}>🥳 Yes, I do!</Text>
                        <Wrap><Input placeholder='Enter code' value={code} onChange={e=>{
                            setCode(e.target.value)
                        }}></Input><Button isLoading={loading} size={"sm"} colorScheme={"green"} onClick={e=>{
                            setLoading(true)
                            fetch(`${process.env.REACT_APP_api_url}/redeeminvite`,{
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${props.token}`,
                                },
                                body: JSON.stringify({ invite_code: code }),
                            }).then((response) => {
                                return response.json();
                            }).then((data) => {
                                setLoading(false)
                                if(data.success){
                                    toast({
                                        title: "Welcome!",
                                        description: data.message,
                                        status: "success"
                                    })
                                }else{
                                    toast({
                                        title: "Error",
                                        description: data.message,
                                        status: "error"
                                    })
                                }
                                return data;
                            });
                            }}>🎫 Redeem</Button></Wrap>
                    </Box>
                    <Box>
                        <Text mb={3}>😔 No, I don't</Text>
                        {/* <Text>Please stop by our Discord Server, introduce yourself, and get vetted to begin creating AI art!</Text> */}
                        <Wrap><Button size={"sm"} colorScheme={"blue"} onClick={()=>{window.open(`https://discord.gg/feverdreams`)}}>👋 Introduce yourself on Discord!</Button></Wrap>
                    </Box>
                </SimpleGrid>
        </Box>
    )
}