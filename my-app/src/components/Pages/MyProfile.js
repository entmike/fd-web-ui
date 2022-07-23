import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Skeleton, Text, Textarea, FormControl, FormLabel, FormHelperText, Code, Link, Box, Input, VStack, HStack, Avatar, Heading, useToast} from '@chakra-ui/react';
import { SocialButton } from 'components/shared/SocialButton';
import { useAuth0 } from '@auth0/auth0-react';
import { FaTwitter } from 'react-icons/fa';
import { update } from 'lodash';

// TODO: This isAuthenticated/token stuff should be in a context <- Agreed, -Mike.
function MyProfile({ isAuthenticated, token }) {
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({social:{},dummy:true});
  const { user } = useAuth0();
  const toast = useToast();
  async function submitProfile() {
    try {
      setLoading(true);
      const { success: profileSuccess } = await fetch(
        'https://api.feverdreams.app/web/profile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profile: userDetails }),
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data.social = data.social?data.social:{}
          return data;
        });
      
      if (profileSuccess) {
        toast({
            title: 'Profile Updated',
            // description: props.value,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
      }
      setLoading(false);
    } catch (error) {
        toast({
            title: 'Could not update',
            // description: props.value,
            status: 'error',
            duration: 4000,
            isClosable: true,
        })
    }
  }
  useEffect(() => {
    if (userDetails.dummy && user) {
        setLoading(true);
        fetch(`https://api.feverdreams.app/user/${user.sub.split("|")[2]}`)
          .then((response) => response.json())
          .then((actualData) => {
            setLoading(false);
            setUserDetails(actualData);
          });
      }
    // TODO: They probably shouldn't even be able to get to this /dream route without being authenticated first
    if (isAuthenticated) {
    //   getDream(token);
    } else {
      console.log('Not Authenticated.');
    }
  }, [isAuthenticated, token]);
  let userAvatar = '/avatar-placeholder.png'
  let userName = 'Loading'
  if(isAuthenticated){
    userAvatar = userDetails
    ? userDetails.avatar
    : '/avatar-placeholder.png';
    userName = userDetails ? userDetails.user_name : 'Loading';
  }
   return (
    <>
      {isAuthenticated ? (
        <Skeleton isLoaded={!loading}>
            <HStack>
            {userDetails && <Avatar size="xl" src={userAvatar} />}
            <VStack alignItems={'left'}>
                <Heading>{userName}</Heading>
                <HStack>
                {userDetails && userDetails.social && userDetails.social.twitter && (
                    <SocialButton
                    label={userDetails.social.twitter}
                    href={`https://twitter.com/${userDetails.social.twitter}`}
                    >
                    <FaTwitter />
                    </SocialButton>
                )}
                </HStack>
            </VStack>
        </HStack>
          <FormControl>
                <FormLabel htmlFor="twitter">Twitter:</FormLabel>
                <Input id="twitter" placeholder="@Your_Name"
                value={(userDetails && userDetails.social && userDetails.social.twitter)?userDetails.social.twitter:""}
                onChange={(event) => {
                    let updatedProfile = JSON.parse(JSON.stringify(userDetails));
                    updatedProfile.social.twitter = event.target.value
                    setUserDetails({ ...userDetails, ...updatedProfile });
                }}/>
            </FormControl>
          <FormControl>
            <FormLabel htmlFor="bio">About you:</FormLabel>
            <Textarea
              id="bio"
              placeholder="About you..."
              value={(userDetails && userDetails.social && userDetails.social.twitter)?userDetails.social.about:""}
              onChange={(event) => {
                let updatedProfile = JSON.parse(JSON.stringify(userDetails));
                updatedProfile.social.about = event.target.value
                setUserDetails({ ...userDetails, ...updatedProfile });
            }}
            />
          </FormControl>
          <Button onClick={submitProfile}>Save</Button>
        </Skeleton>
      ) : (
        <Text>To manage your profile, log in.</Text>
      )}
    </>
  );
}

export default MyProfile;
