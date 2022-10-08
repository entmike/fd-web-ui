import { useState, useEffect } from 'react';
import { HelpHeader } from './HelpHeader';
import { dt } from '../../utils/dateUtils';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Wrap, Center, IconButton, Text, Button, ButtonGroup, VStack, Link } from '@chakra-ui/react';
// import { Link } from 'react-router-dom';
export function Terms(props) {
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth0()
    const navigate = useNavigate()
    
    function agree(){
        setLoading(true)
        fetch(
            `${process.env.REACT_APP_api_url}/v3/tosagree`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${props.token}`,
              },
              body: JSON.stringify({ uuid: props.tos.uuid }),
            }
        ).then((response) => {
            setLoading(false)
            navigate(`/`);
            return true
        })
    }
    useEffect(() => {
        
    }, []);

    return(
        props.tos && <Box m={5}>
            <HelpHeader title="Terms of Service" description="You must agree to these Terms of Service in order to use this website."></HelpHeader>
            <Text fontWeight={"bold"}>Effective: {dt(props.tos.timestamp)}</Text>
            <Box mt={5} borderWidth={1} p={5} borderRadius="md" className='TOS'>

                <Heading m={5} size={"md"}>Welcome!</Heading>
                <p>Thanks for checking out the Fever Dreams website (the "Site").  Fever Dreams is a web site that allows users to create and browse Artificial Intelligence (AI) generated images.</p>
                <p>These Terms of Service (the "TOS") explain what rights you have with respect to the Site generated images which you generate (the "Images") and your responsibilities during use of the Site.</p>
                <p>Please read the TOS carefully.  It is intentionally brief and simple to read.  A privacy policy and data section which explains how your data is used is explained below.</p>
                <p>This Agreement is entered into by Fever Dreams and the entity or person agreeing to these terms ("User") and govern the User's access to and use of the Site.  This Agreement is effective when the User is presented with this TOS and then selects "I Agree".</p>
                <p>These terms may be changed and presented again to the User over time.  Any change must be accepted in order to continue using the Site.  If you decide to not accept the terms of the TOS, you may not use the Site.</p>
                
                <Heading m={5} size={"md"}>1. User Requirements</Heading>
                <Text>By accessing the Site, you attest that you are at least 18 years old.  Content exposed on the Site may contain occasionally inappropriate material for some settings (places of employment, faith, or school.)</Text>
                <Text>While Fever Dreams has a zero-tolerance policy for illegal and explicit content, artistic/accidental nudity may appear.  Users are responsible for classifying these types of Images as "Not Safe for Work" (NSFW) in order to make the Site viewable in such settings as much as is practically possible.</Text>

                <Heading m={5} size={"md"}>2. Community and Content</Heading>
                <Text>While Fever Dreams respects artistic freedom, this is also a shared community platform meant to make AI generated works accessible to view and create without fear of encountering offensive, hateful, hostile, or illegal content.</Text>
                <Text>We rely on users to self-curate their content, meaning that before Images are available for viewing, the User must first screen any Images that have been rendered in order to delete undesired outputs, as well as any Images that may appear offensive or illegal in nature.</Text>
                <Text>Since Images must be curated by Users, this means there should be very few incidents involving accidental release of inappropriate Images.  Specific examples of inappropriate content on the Site include:</Text>
                <ul>
                    <li>Sexually explicit or lewd content</li>
                    <li>Excessive gore or nudity</li>
                    <li>Hate speech or racist imagery</li>
                    <li>Anything else that moderators deem inappropriate.</li>
                </ul>
                <Text>Fever Dreams has a zero-tolerance policy to this type of content.  Depending on the severity and circumstances, a warning may or may not be issued to the User, or an immediate ban without warning may occur, including the deletion of all the offending User's Images.</Text>

                <Heading m={5} size={"md"}>3. Rights</Heading>
                <Text>Fever Dreams grants the User a license to the Images under the Creative Commons Noncommercial 4.0 Attribution International License (<Link target={"_blank"} href="https://creativecommons.org/licenses/by-nc/4.0/legalcode">Details Here</Link>)</Text>
                
                <Heading m={5} size={"md"}>4. Privacy Policy and Data Collected</Heading>
                <Text>While using the Site, certain pieces of information are used to authenticate your user account and safeguard the Site against malicious activities.  This information includes:</Text>
                <ul>
                    <li>Your user name</li>
                    <li>Your IP address</li>
                    <li>Your E-Mail address associated with your user account</li>
                    <li>Text prompts and related parameters required to render an Image</li>
                    <li>Cookies and Local Storage</li>
                </ul>
                <Text>Your E-Mail address will NOT be sold or shared to 3rd parties and will only be used to send Site related communications, if needed.</Text>
                <Text>Your Image data will NOT be sold or shared to 3rd parties and is only retained for User and Site functionality, Site moderation, and audit/retention reasons.</Text>
                <ButtonGroup>
                    <Button isLoading={loading} size={"sm"} colorScheme={"green"} onClick={agree}><Center>I Agree</Center></Button>
                    <Button isLoading={loading} size={"sm"} colorScheme={"red"} onClick={()=>logout({ returnTo: window.location.origin })}><Center>I Decline</Center></Button>
                </ButtonGroup>
            </Box>
        </Box>
    )
}