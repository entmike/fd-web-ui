import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Skeleton, Text, Textarea, FormControl, FormLabel, FormHelperText, Code, Link, Box, Select } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

// TODO: This isAuthenticated/token stuff should be in a context <- Agreed, -Mike.
function CreateDreamPage({ isAuthenticated, token }) {
  const [dream, setDream] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth0();

  async function getDream(token) {
    setLoading(true);

    try {
      const dreamData = await fetch('https://api.feverdreams.app/web/dream', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          return data;
        });

      if (dreamData) {
        setDream(dreamData);
      }

      setLoading(false);
    } catch (error) {
      console.log('Unable to catch dreams...');
    }
  }

  useEffect(() => {
    // TODO: They probably shouldn't even be able to get to this /dream route without being authenticated first
    if (isAuthenticated) {
      getDream(token);
    } else {
      console.log('Not Authenticated.');
    }
  }, [isAuthenticated, token]);

  async function handleInitiateDream() {
    try {
      setLoading(true);
      const data = await fetch(
        'https://api.feverdreams.app/web/dream',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ dream: dream }),
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          return data
        });

      if(data.success) setDream(data.dream)
      setLoading(false);
    } catch (error) {
      console.log('Unable to induce dream state');
    }
  }

  function handleWakeUp() {
    setLoading(true);
    fetch(`https://api.feverdreams.app/awaken/${user.sub.split('|')[2]}`).then(
      (response) => {
        setDream({});
        setLoading(false);
      }
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Skeleton isLoaded={!loading}>
          <FormControl>
            <FormLabel htmlFor="dreamprompt">Dream Count: {dream && dream.count !== undefined? dream.count : '[N/A Not currently dreaming]'}</FormLabel>
            <FormHelperText>
              <Box mb={5} p={5} borderRadius="md" borderWidth={1}>
                <p>{`Dreams are used to give the Fever Dreams something to render when regular jobs cannot keep all the GPUs busy.  Dreams have a mad-libs placeholder convention such as the following example:`}<br/>
                <Code>{"a {adjectives} {locations} spanning across a river of {of_something}, art by {progrock/artist}, trending on artstation"}</Code><br/><br/>
                </p>
                <p style={{"padding-left":"20px"}}>
                  <ul>
                    <li>
                      {`Only "simple" text phrases so no special characters like `}<Code>`{`{}[]",'`}</Code>
                    </li>
                    <li>
                      {`This will randomly grab from a pool of files by the name contained in `}<Code>{`{brackets}`}</Code>{` (so for example, {adjectives} translates to adjectives.txt and {progrock/artist} translates to progrock/artist.txt  The current list of modifiers can be seen `}
                      <Link href="https://github.com/entmike/dd-discord-bot/tree/main/prompt_salad" target="_blank">here</Link>. 
                    </li>
                    <li>
                      {`If you have a good list and want to add it to the repo, then by all means let me know!`}
                    </li>
                    <li>
                      {`Each user currently gets one dream to choose.  You can change it at any point and it will be updated.`}
                    </li>
                    <li>
                      {`The oldest dream is the first chosen when an agent enters dream mode.  When a dream is chosen, its last updated timestamp is updated and sent to the bottom of the list of dreams and will rotate.`}
                    </li>
                  </ul>
                </p>
              </Box>
            </FormHelperText>
            <Textarea
              id="dreamprompt"
              placeholder="Your dream here..."
              value={dream.prompt}
              onChange={(event) => {
                let updatedDream = JSON.parse(JSON.stringify(dream));
                updatedDream.prompt = event.currentTarget.value;
                setDream({ ...dream, ...updatedDream });
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="diffusion_model">Diffusion Model</FormLabel>
            <Select placeholder='Select Diffusion Model' defaultValue={"512x512_diffusion_uncond_finetune_008100"} value={dream.diffusion_model} onChange={(event) => {
                let updatedDream = JSON.parse(JSON.stringify(dream));
                let value = event.target.selectedOptions[0].value;
                updatedDream.diffusion_model = value;
                setDream({ ...dream, ...updatedDream });
              }}>
              {
                [
                  {"key" : "256x256_diffusion_uncond", "text" : "256x256_diffusion_uncond"},
                  {"key" : "512x512_diffusion_uncond_finetune_008100", "text" : "512x512_diffusion_uncond_finetune_008100"},
                  {"key" : "PulpSciFiDiffusion", "text" : "PulpSciFiDiffusion"},
                  {"key" : "pixel_art_diffusion_hard_256", "text" : "pixel_art_diffusion_hard_256"},
                  {"key" : "pixel_art_diffusion_soft_256", "text" : "pixel_art_diffusion_soft_256"},
                  {"key" : "pixelartdiffusion4k", "text" : "pixelartdiffusion4k"},
                  {"key" : "PADexpanded", "text" : "PADexpanded"},
                  {"key" : "watercolordiffusion", "text" : "watercolordiffusion"},
                  {"key" : "watercolordiffusion_2", "text" : "watercolordiffusion_2"},
                  {"key" : "256x256_openai_comics_faces_v2.by_alex_spirin_114k", "text" : "256x256_openai_comics_faces_v2.by_alex_spirin_114k"},
                  {"key" : "portrait_generator_v001_ema_0.9999_1MM", "text" : "portrait_generator_v001_ema_0.9999_1MM"},
                  {"key" : "portrait_generator_v1.5_ema_0.9999_165000", "text" : "portrait_generator_v1.5_ema_0.9999_165000"},
                  {"key" : "FeiArt_Handpainted_CG_Diffusion", "text" : "FeiArt_Handpainted_CG_Diffusion"},
                  {"key" : "Ukiyo-e_Diffusion_All_V1.by_thegenerativegeneration", "text" : "Ukiyo-e_Diffusion_All_V1.by_thegenerativegeneration"},
                  {"key" : "IsometricDiffusionRevrart512px", "text" : "IsometricDiffusionRevrart512px"},
                  {"key" : "liminal_diffusion_v1", "text" : "liminal_diffusion_v1"},
                  {"key" : "floral_diffusion", "text" : "floral_diffusion"}
                ].map(diffusion_model=>{
                  return <option value={diffusion_model.key}>{diffusion_model.text}</option>
                })
              }
            </Select>
            {<FormHelperText>Diffusion_model of choice.  Each model has its own "flavor".  Try them all to see what works for you.</FormHelperText>}
          </FormControl>
          <Button onClick={handleInitiateDream}>Dream</Button>
          <Button onClick={handleWakeUp} disabled={!dream}>
            Wake Up
          </Button>
        </Skeleton>
      ) : (
        <Text>You are not logged in. To create a dream, log in first.</Text>
      )}
    </>
  );
}

export default CreateDreamPage;
