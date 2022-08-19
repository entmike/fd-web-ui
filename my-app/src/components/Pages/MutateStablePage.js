import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Box,
  HStack,
  Heading,
  Image,
  Skeleton,
  Text,
  SimpleGrid,
  Code,
  Kbd,
  Grid,
  GridItem,
  Textarea,
  IconButton,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  RadioGroup,
  Radio,
  Stack,
  Switch,
  Select,
  Checkbox,
  VStack,
  Center
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { join, update } from 'lodash';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { id } from 'date-fns/locale';

// TODO: This isAuthenticated/token stuff should be in a context <- Agreed, -Mike.
function MutateStablePage({ isAuthenticated, token, mode }) {
  const [job, setJob] = useState({});
  let sh = localStorage.getItem("show-mutate-help");
  let showhelp = (sh==='false')?false:true
  const [show_help, setShowHelp] = useState(showhelp);
  //   const [text_prompt, setTextPrompt] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth0();
  const params = useParams();

  async function getJob(job_uuid) {
    setLoading(true);
    let discord_id
    if(user){
      discord_id = user.sub.split("|")[2]
    }
    try {
      const jobData = await fetch(
        `https://api.feverdreams.app/alpha/job/${job_uuid}`,
        {
          // headers: {
          //   'Content-Type': 'application/json',
          //   Authorization: `Bearer ${token}`,
          // },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (!data) data = {
            uuid : job_uuid,
            views : 0,
            str_author : discord_id,
            gpu_preference : "medium",
            editable : true,
            nsfw: false,
            width_height:[ 1024, 512 ],
            seed: -1,
            scale : 5.0,
            eta : 0.0,
            steps: 50,
            prompt: "A beautiful painting of a singular lighthouse, shining its light across a tumultuous sea of blood by greg rutkowski and thomas kinkade, Trending on artstation"
          }

          if(mode==="edit"){
            if(user){
              discord_id = user.sub.split("|")[2]
              if(discord_id !== data.str_author){
                data.editable = false
              }else{
                data.editable = (data.status == "queued" || data.status == "rejected")
              }
            }
          }else{
            data.editable = true
          }
          return data;
        });

      if (jobData) {
        setJob(jobData);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.log('Unable to get job...');
    }
  }

  useEffect(() => {
    params && getJob(params.uuid);
  }, []);
  
  async function save() {
    try {
      // return
      setLoading(true)
      console.log(job)
      const { success: mutateSuccess, new_record: newRecord } = await fetch(
        `https://api.feverdreams.app/web/stable/${mode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ job: job }),
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          return data;
        });
      if (mutateSuccess) {
        if(mode==="mutate"){
          let uuid = newRecord.uuid;
          window.location.href = `/piece/${uuid}`;
        }
        if(mode==="edit"){
          window.location.href = `/piece/${job.uuid}`;
        }
      }
      setLoading(false);
    } catch (error) {
      console.log('Unable to mutate.');
    }
  }

  if (!isAuthenticated) {
    return <Text>You are not logged in. To mutate, log in first.</Text>;
  }

  return (
    <>
      <Center>
        <Box maxW={"1024px"}>
          <Skeleton isLoaded={!loading}>
            <Center>
              <VStack>
                <Heading size={"sm"}>{mode==="mutate"?"Mutate":"Edit"}: {job ? job.uuid : 'Loading'}</Heading>
                <Image src={`https://images.feverdreams.app/thumbs/512/${job.uuid}.jpg`}></Image>
              </VStack>
            </Center>
            <SimpleGrid columns={{sm: 2, md: 2}} spacing="20px">
              <FormControl>
                <FormLabel htmlFor="show_help">🤔 Show Help</FormLabel>
                <Switch
                  id="show_help"
                  isChecked = {show_help}
                  onChange={(event) => {
                    localStorage.setItem("show-mutate-help",event.target.checked)
                    setShowHelp(event.target.checked)
                  }}
                />
                {show_help && <FormHelperText>Show parameter help</FormHelperText>}
              </FormControl>
              <FormControl>
                  <FormLabel htmlFor="gpu_preference">GPU Preference</FormLabel>
                  <Select isDisabled = {!job.editable} 
                      id = "gpu_preference"
                      defaultValue={"medium"}
                      value={job.gpu_preference} onChange={(event) => {
                      let updatedJob = JSON.parse(JSON.stringify(job));
                      let value = event.target.selectedOptions[0].value;
                      updatedJob.gpu_preference = value
                      setJob({ ...job, ...updatedJob });
                    }}>
                    {
                      [
                        {"key" : "small", "text" : "Small (10-12 GB)"},
                        {"key" : "medium", "text" : "Medium (24 GB)"},
                        {"key" : "large", "text" : "Large (48 GB)"},
                        // {"key" : "titan", "text" : "Titan (80 GB)"}
                      ].map(shape=>{
                        return <option value={shape.key}>{shape.text}</option>
                      })
                    }
                  </Select>
                  {show_help && <FormHelperText>Select your prefered GPU size.  Why not always pick "Large"?  Because you are a decent human being.</FormHelperText>}
                </FormControl>
              {/* <FormControl>
                <FormLabel htmlFor="agent_preference">Agent Preference (temporary)</FormLabel>
                <Input
                  id="agent_preference"
                  value={job.agent_preference?job.agent_preference:"any"}
                  onChange={(event) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.agent_preference = event.currentTarget.value;
                    setJob({ ...job, ...updatedJob });
                  }}
                />
                {show_help && <FormHelperText>Agent Preference (temporary) - Allows you to prefer a specific agent by ID for testing/sizing reasons.  Leave as "any" for normal behavior.</FormHelperText>}
              </FormControl> */}
            </SimpleGrid>
            <FormControl>
              <FormLabel htmlFor="prompt">Prompt</FormLabel>
                {job.prompt && 
                    <FormControl>
                      <FormLabel htmlFor={`prompt`}>Text</FormLabel>
                      <Textarea
                        isDisabled = {!job.editable}
                        id={`prompt`}
                        type="text"
                        value={job.prompt}
                        onChange={(event) => {
                          let updatedJob = JSON.parse(JSON.stringify(job));
                          updatedJob.prompt = event.target.value;
                          setJob({ ...job, ...updatedJob });
                        }}
                      />
                      {show_help && <FormHelperText>Phrase, sentence, or string of words and phrases describing what the image should look like. The words will be analyzed by the AI and will guide the diffusion process toward the image you describe.</FormHelperText>}
                    </FormControl>
              }
            </FormControl>
            <SimpleGrid columns={{sm: 2, md: 4}} spacing="20px">
              <FormControl>
                <FormLabel htmlFor="seed">Image Seed</FormLabel>
                <NumberInput isDisabled = {!job.editable}
                  id="seed"
                  defaultValue={-1}
                  value={job.seed}
                  min={-1}
                  max={2 ** 32}
                  clampValueOnBlur={true}
                  onChange={(value) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.seed = parseInt(value);
                    setJob({ ...job, ...updatedJob });
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {show_help && <FormHelperText>
                  Image seed used during rendering. Specify -1 for a random seed.
                </FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="steps">Steps</FormLabel>
                <NumberInput isDisabled = {!job.editable}
                  id="steps"
                  defaultValue={job.steps}
                  min={10}
                  max={150}
                  clampValueOnBlur={true}
                  onChange={(value) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.steps = parseInt(value);
                    setJob({ ...job, ...updatedJob });
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {show_help && <FormHelperText>
                  Increasing steps will provide more opportunities for the AI to
                  adjust the image, and each adjustment will be smaller, and thus will
                  yield a more precise, detailed image. Increasing steps comes at the
                  expense of longer render times.
                </FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="scale">
                  Scale
                </FormLabel>
                <NumberInput isDisabled = {!job.editable}
                  id="scale"
                  value={job.scale}
                  precision={2}
                  step={0.1}
                  min={1}
                  max={15}
                  onChange={(value) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.scale = parseFloat(value);
                    setJob({ ...job, ...updatedJob });
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {show_help && <FormHelperText>
                  Scale, like clip_guidance_scale but not.
                </FormHelperText>}
              </FormControl>
            <FormControl>
              <FormLabel htmlFor="eta">ETA</FormLabel>
              <NumberInput isDisabled = {!job.editable}
                id="eta"
                step={0.1}
                precision={2}
                defaultValue={0.8}
                value={job.eta}
                min={0.01}
                max={10}
                onChange={(value) => {
                  let updatedJob = JSON.parse(JSON.stringify(job));
                  updatedJob.eta = parseFloat(value);
                  setJob({ ...job, ...updatedJob });
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {show_help && <FormHelperText>
                eta (greek letter η) shit man hell if i know.
              </FormHelperText>}
            </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={{sm: 2, md: 2}} spacing="20px">
                <FormControl>
                  <FormLabel htmlFor="aspect_ratio">Aspect Ratio Presets</FormLabel>
                  <Select id = "aspect_ratio" isDisabled = {!job.editable} value={job.aspect_ratio} placeholder='Select an aspect ratio...' onChange={(event) => {
                      let updatedJob = JSON.parse(JSON.stringify(job));
                      let value = event.target.selectedOptions[0].value;
                      updatedJob.aspect_ratio = value
                      if(value!=="free"){
                        let w = updatedJob.width_height[0]
                        let w_ratio = parseInt(updatedJob.aspect_ratio.split(":")[0])
                        let h_ratio = parseInt(updatedJob.aspect_ratio.split(":")[1])
                        let w_h = [parseInt(w), parseInt(h_ratio/w_ratio * w)]
                        updatedJob.width_height = w_h;
                      }
                      setJob({ ...job, ...updatedJob });
                    }}>
                    {
                      [
                        {"key" : "free", "text" : "Free"},
                        {"key" : "1:1", "text" : "1:1 (Square)"},
                        {"key" : "16:9", "text" : "16:9 (Film/Display)"},
                        {"key" : "4:5", "text" : "4:5 (Portrait)"},
                        {"key" : "4:1", "text" : "4:1 (Pano)"},
                        {"key" : "1:4", "text" : "1:4 (Skyscraper)"},
                        {"key" : "5:3", "text" : "5:3 (Landscape)"}
                      ].map(shape=>{
                        return <option value={shape.key}>{shape.text}</option>
                      })
                    }
                  </Select>
                  {show_help && <FormHelperText>Shape presets to apply to width/height.  Height will be calculated on aspect ratio based on width.</FormHelperText>}
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="lock_ratio">Lock Aspect Ratio</FormLabel>
                  <Switch isDisabled = {!job.editable && job.aspect_ratio==="free"}
                    id="lock_ratio"
                    isChecked={(job.lock_ratio==="yes"||job.lock_ratio===true)?true:false}
                    onChange={(event) => {
                      let updatedJob = JSON.parse(JSON.stringify(job));
                      updatedJob.lock_ratio = event.target.checked ? true : false;
                      setJob({ ...job, ...updatedJob });
                    }}
                  />
                  {show_help && <FormHelperText>Lock width/height to selected aspect ratio.</FormHelperText>}
                </FormControl>
              </SimpleGrid> 
              <SimpleGrid columns={{sm: 2, md: 2}} spacing="20px">
                <FormControl>
                  <FormLabel htmlFor="width">Width</FormLabel>
                  <NumberInput isDisabled = {!job.editable}
                    id="width"
                    step={64}
                    defaultValue={1280}
                    value={job.width_height?job.width_height[0]:1280}
                    min={128}
                    max={2560}
                    clampValueOnBlur={true}
                    onChange={(value) => {
                      let updatedJob = JSON.parse(JSON.stringify(job));
                      updatedJob.width_height=updatedJob.width_height || [1280,768]
                      updatedJob.width_height[0] = parseInt(value);
                      if(updatedJob.aspect_ratio !== "free" && updatedJob.lock_ratio){
                        let w = updatedJob.width_height[0]
                        let w_ratio = parseInt(updatedJob.aspect_ratio.split(":")[0])
                        let h_ratio = parseInt(updatedJob.aspect_ratio.split(":")[1])
                        let w_h = [parseInt(w), parseInt(h_ratio/w_ratio * w)]
                        updatedJob.width_height = w_h;
                      }
                      setJob({ ...job, ...updatedJob });
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper/>
                      <NumberDecrementStepper/>
                    </NumberInputStepper>
                  </NumberInput>
                  {show_help && <FormHelperText>
                    Image width.  Must be a multiple of 64.
                  </FormHelperText>}
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="height">Height</FormLabel>
                  <NumberInput isDisabled = {!job.editable}
                    id="height"
                    step={64}
                    defaultValue={768}
                    value={job.width_height?job.width_height[1]:768}
                    min={128}
                    max={2560}
                    clampValueOnBlur={true}
                    onChange={(value) => {
                      let updatedJob = JSON.parse(JSON.stringify(job));
                      updatedJob.width_height=updatedJob.width_height || [1280,768]
                      updatedJob.width_height[1] = parseInt(value);
                      if(updatedJob.aspect_ratio !== "free" && updatedJob.lock_ratio){
                        let h = updatedJob.width_height[1]
                        let w_ratio = parseInt(updatedJob.aspect_ratio.split(":")[0])
                        let h_ratio = parseInt(updatedJob.aspect_ratio.split(":")[1])
                        let w_h = [parseInt((w_ratio/h_ratio * h)), parseInt(h)]
                        updatedJob.width_height = w_h;
                      }
                      setJob({ ...job, ...updatedJob });
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper/>
                      <NumberDecrementStepper/>
                    </NumberInputStepper>
                  </NumberInput>
                  {show_help && <FormHelperText>
                    Image height.  Must be a multiple of 64.
                  </FormHelperText>}
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel htmlFor="nsfw">NSFW?</FormLabel>
                <Switch isDisabled = {!job.editable}
                  id="nsfw"
                  isChecked={(job.nsfw==="yes"||job.nsfw===true)?true:false}
                  onChange={(event) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.nsfw = event.target.checked ? true : false;
                    setJob({ ...job, ...updatedJob });
                  }}
                />
                {show_help && <FormHelperText>Flag as NSFW. This does NOT mean you can render illegal or sexually explicit content</FormHelperText>}
              </FormControl>
            <Button isDisabled = {!job.editable} onClick={save}>{mode==="edit"?"Edit":"Mutate"}</Button>
          </Skeleton>
        </Box>
      </Center>
    </>
  );
}

export default MutateStablePage;
