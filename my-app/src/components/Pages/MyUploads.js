import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Skeleton, Text, Textarea, FormControl, FormLabel, FormHelperText, Code, Link, Box, Input, VStack, HStack, Avatar, Heading, useToast} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import FileUpload from 'components/shared/FileUpload';
import { useForm } from "react-hook-form";

// TODO: This isAuthenticated/token stuff should be in a context <- Agreed, -Mike.
function MyUploads({ isAuthenticated, token }) {
    const [loading, setLoading] = useState(true);
    const [documentArray, setDocumentArray] = useState(null);
    const [userDetails, setUserDetails] = useState({social:{},dummy:true});
    const { user } = useAuth0();
    const toast = useToast();
    const {
        handleSubmit,
        register,
        setError,
        control,
    formState: { errors, isSubmitting },
    } = useForm()

    useEffect(() => {
        setLoading(false)
        // Fetch uploads
    }, [isAuthenticated, token]);
  
    async function submitUpload(event) {
        event.preventDefault();
            setLoading(true);
            try {
                let formData = new FormData()
                console.log(documentArray)
                formData.append('file', documentArray, documentArray.name)
                await fetch(
                    `https://api.feverdreams.app/web/uploadart`,
                    {
                        method: 'POST',
                        headers: {
                            // 'Content-Type': 'multipart/form-data',   Commented out on purpose
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }
                ).then((response) => {
                    console.log(response)
                    return response.json();
                })
            setLoading(false);
        } catch (error) {
            // alert("Error." + error)
        //   setError('Invalid username or password');
            setLoading(false);
        //   setEmail('');
        //   setPassword('');
        }
    }
   return (
    <>
      {isAuthenticated ? (
        <Skeleton isLoaded={!loading}>
            <Heading>My Uploads</Heading>
            <Box mt={5} borderRadius={"md"} borderWidth={1} p={5}>
                <Text mb={5}>My Uploads allows you to share your AI art on Fever Dreams.</Text>
                <ul style={{marginLeft:"20px"}}>
                    <li>You can control whether or not your parameters are visible.</li>
                    <li>You may delete anything you upload at any time.</li>
                    <li>Files must be in DocumentArray format and structured based on the default structure of DiscoArt.</li>
                </ul>
            </Box>
        <form onSubmit={submitUpload}>
            <FileUpload 
                bubbleChange={file => {setDocumentArray(file)}}
                name="documentarray"
                acceptedFileTypes="*.lz4"
                isRequired={true}
                placeholder="Your .LZ4"
                control={control}>
                Upload LZ4
            </FileUpload>
            <Button type="submit" colorScheme={"green"} variant="outline" mt={4}>Upload</Button>
        </form>
        </Skeleton>
      ) : (
        <Text>To upload your art, log in.</Text>
      )}
    </>
  );
}

export default MyUploads;
