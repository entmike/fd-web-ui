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

// TODO: This isAuthenticated/token stuff should be in a context <- Agreed, -Mike.
function MutatePage({ isAuthenticated, token }) {
  const [job, setJob] = useState({});
  const [show_help, setShowHelp] = useState({});
  //   const [text_prompt, setTextPrompt] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth0();
  const params = useParams();

  async function getJob(job_uuid) {
    setLoading(true);

    try {
      const jobData = await fetch(
        `https://api.feverdreams.app/job/${job_uuid}`,
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
          data.experimental = true
          let isLegacy = data.discoart_tags?false:true
          if(data.text_prompts) {
            data.text_prompts = data.text_prompts
          }else{
            if(data.discoart_tags) {
              data.text_prompts = data.discoart_tags.text_prompts
            }else{
              if(data.results){
                data.text_prompts = data.results.text_prompts["0"]
              }else{
                // Legacy
                let tp = data.text_prompt?data.text_prompt:"[]"
                let a
                try{
                  a = JSON.parse(tp)
                }catch(e){
                  a = [tp]
                }
                data.text_prompts = a
              }
            }
          }
          data.nsfw = false
          
          if(!data.results && !data.discoart_tags){
            data.results = {
                cut_overview : (data.cut_overview !==undefined)?data.cut_overview:"[12]*400+[4]*600",
                cut_innercut : (data.cut_innercut !==undefined)?data.cut_innercut:"[4]*400+[12]*600",
                cut_ic_pow : (data.cut_ic_pow !==undefined)?data.cut_ic_pow:1.,
                cut_icgray_p : (data.cut_icgray_p !==undefined)?data.cut_icgray_p:"[0.2]*400+[0]*600",
                clip_models: (data.clip_models !==undefined)?data.clip_models:["ViT-B-32::openai","ViT-B-16::openai","RN50::openai"],
                width_height: (data.width_height !==undefined)?data.width_height:[ 1280, 768 ],
                seed: (data.seed !==undefined)?data.seed:-1,
                set_seed: (data.set_seed !==undefined)?data.set_seed:-1,
                skip_steps: (data.skip_steps !==undefined)?data.skip_steps:0,
                steps: (data.steps !==undefined)?data.steps:250,

                init_scale: (data.init_scale !==undefined)?data.init_scale:1000,
                clip_guidance_scale: (data.clip_guidance_scale !==undefined)?data.clip_guidance_scale:5000,

                tv_scale: (data.tv_scale !==undefined)?data.tv_scale:0,
                range_scale: (data.range_scale !==undefined)?data.range_scale:150,
                sat_scale: (data.sat_scale !==undefined)?data.sat_scale:0,
                cutn_batches: (data.cutn_batches !==undefined)?data.cutn_batches:4,
                
                diffusion_model: (data.diffusion_model !==undefined)?data.diffusion_model:"512x512_diffusion_uncond_finetune_008100",
                use_secondary_model: (data.use_secondary_model !==undefined)?data.use_secondary_model:true,
                diffusion_sampling_mode: (data.diffusion_sampling_mode !==undefined)?data.diffusion_sampling_mode:"ddim",

                perlin_init: (data.perlin_init !==undefined)?data.perlin_init:false,
                perlin_mode: (data.perlin_mode !==undefined)?data.perlin_mode:"mixed",
                eta: (data.eta !==undefined)?data.eta:0.8,
                clamp_grad: (data.clamp_grad !==undefined)?data.clamp_grad:true,
                clamp_max: (data.clamp_max !==undefined)?data.clamp_max:0.05,

                randomize_class: (data.randomize_class !==undefined)?data.randomize_class:true,
                clip_denoised: (data.clip_denoised !==undefined)?data.clip_denoised:false,
                fuzzy_prompt: (data.fuzzy_prompt !==undefined)?data.fuzzy_prompt:false,
                rand_mag: (data.rand_mag !==undefined)?data.rand_mag:0.05,

                use_vertical_symmetry: (data.use_vertical_symmetry !==undefined)?data.use_vertical_symmetry:false,
                use_horizontal_symmetry: (data.use_horizontal_symmetry !==undefined)?data.use_horizontal_symmetry:false,
                transformation_percent: (data.transformation_percent !==undefined)?data.transformation_percent:[0.09],
                skip_augs: (data.skip_augs !==undefined)?data.skip_augs:false,

                on_misspelled_token: (data.on_misspelled_token !==undefined)?data.on_misspelled_token:"ignore",
                text_clip_on_cpu: (data.text_clip_on_cpu !==undefined)?data.text_clip_on_cpu:false,
                
                aspect_ratio: (data.aspect_ratio !==undefined)?data.aspect_ratio:"free",
                lock_ratio: (data.lock_ratio !==undefined)?data.lock_ratio:false
              }
          }
          let source
          if(data.discoart_tags) {
            source = data.discoart_tags
          }
          if(data.results) {
            source = data.results
          }
          data.set_seed = source.seed?source.seed:source.set_seed?source.set_seed:-1
          data.clip_guidance_scale = source.clip_guidance_scale
          data.cutn_batches = source.cutn_batches
          data.range_scale = source.range_scale
          data.sat_scale = source.sat_scale
          data.clamp_grad = source.clamp_grad
          data.clamp_max = source.clamp_max
          data.eta = source.eta
          data.skip_steps = source.skip_steps
          data.use_horizontal_symmetry = source.use_horizontal_symmetry || false
          data.use_vertical_symmetry = source.use_vertical_symmetry || false
          data.randomize_class = source.randomize_class
          data.skip_augs = source.skip_augs
          data.clip_denoised = source.clip_denoised
          data.fuzzy_prompt = source.fuzzy_prompt || false
          data.diffusion_model = source.diffusion_model
          data.diffusion_sampling_mode = source.diffusion_sampling_mode || "ddim"
          data.cut_ic_pow = source.cut_ic_pow
          data.cut_overview = source.cut_overview
          data.cut_innercut = source.cut_innercut
          data.cut_icgray_p = source.cut_icgray_p
          data.use_secondary_model = source.use_secondary_model
          data.width_height = source.width_height
          data.transformation_percent = source.transformation_percent || [0.09]
          // UI-specific
          data.aspect_ratio = data.aspect_ratio || "free"
          data.lock_ratio = data.lock_ratio || false
          // Legacy
          let cm = []
          if(source.RN101) cm.push("RN101::openai")
          if(source.RN50) cm.push("RN50::openai")
          if(source.RN50x16) cm.push("RN50x16::openai")
          if(source.RN50x4) cm.push("RN50x4::openai")
          if(source.RN50x64) cm.push("RN50x64::openai")
          if(source.ViTB16) cm.push("ViT-B-16::openai")
          if(source.ViTB32) cm.push("ViT-B-32::openai")
          if(source.ViTL14) cm.push("ViT-L-14::openai")
          if(source.ViTL14_336) cm.push("ViT-L-14-336::openai")
          if(cm.length > 0)
            data.clip_models = cm
          if(source.clip_models) data.clip_models = source.clip_models
          // Older Way
          return data;
        });

      if (jobData) {
        setJob(jobData);

        // This seems to be tedious to have to do for each field...
        // setTextPrompt(jobData.text_prompt)
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

  async function submitMutate() {
    try {
      console.log(job)
      // return
      setLoading(true)      
      const { success: mutateSuccess, new_record: newRecord } = await fetch(
        'https://api.feverdreams.app/web/mutate',
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
          // console.log(data);
          return data;
        });
      if (mutateSuccess) {
        let uuid = newRecord.uuid;
        window.location.href = `/piece/${uuid}`;
      }
      setLoading(false);
    } catch (error) {
      console.log('Unable to mutate.');
    }
  }

  if (!isAuthenticated) {
    return <Text>You are not logged in. To mutate, log in first.</Text>;
  }

  function updateClip(clipmodel, checked){
    let clip_models = job.clip_models || []
    let foundIndex = -1
    clip_models.map((cm,i)=>{
      if(cm===clipmodel) foundIndex = i
    })
    if(foundIndex===-1 && checked){
      clip_models.push(clipmodel)
    }
    if(foundIndex!==-1 && !checked){
      clip_models.splice(foundIndex, 1)
    }
    return clip_models
  }

  function hasClip(clipmodel) {
    let clip_models = job.clip_models || []
    let found = false
    clip_models.map(cm=>{
      if(cm===clipmodel) found = true
    })
    return found
  }

  return (
    <>
      <Center>
        <Box maxW={"1024px"}>
          <Skeleton isLoaded={!loading}>
            <Center>
              <VStack>
                <Heading size={"sm"}>Mutate: {job ? job.uuid : 'Loading'}</Heading>
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
                    setShowHelp(event.target.checked)
                  }}
                />
                {show_help && <FormHelperText>Show parameter help</FormHelperText>}
              </FormControl>
              <FormControl>
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
              </FormControl>
            </SimpleGrid>
            <FormControl>
              <FormLabel htmlFor="text_prompts">Text Prompts</FormLabel>
              { job.text_prompts && job.text_prompts.length === 0 && <IconButton onClick={event=>{
                  let updatedJob = JSON.parse(JSON.stringify(job));
                  updatedJob.text_prompts.push("New Prompt:1")
                  setJob({ ...job, ...updatedJob });
                }}
                  colorScheme='green'
                  aria-label='Add'
                  icon={<AddIcon />}
                />}
                {job.text_prompts && job.text_prompts.length>0 && job.text_prompts.map((prompt,index)=>{
                  let a = prompt.split(":")
                  let text = a[0]
                  let weight = 1
                  if(a.length>1) {
                    weight = parseFloat(a[a.length-1])
                    let b = prompt.split(":")
                    b.splice(a.length-1,1)
                    text = b.join(":")
                  }
                  return <SimpleGrid columns={{sm: 1, md: 2}} spacing="20px">
                    <FormControl>
                      <FormLabel htmlFor={`tp-weight-${index}`}>Weight</FormLabel>
                      <NumberInput
                        id={`tp-weight-${index}`}
                        step={0.1}
                        precision={2}
                        // defaultValue={weight}
                        value={weight}
                        min={-100}
                        max={100}
                        onChange={(value) => {
                          let updatedJob = JSON.parse(JSON.stringify(job));
                          let b = updatedJob.text_prompts[index].split(":")
                          let text = b[0]
                          if(b.length>2) text = b.splice(b.length-1,1).join(":")
                          updatedJob.text_prompts[index] = `${text}:${value}`;
                          setJob({ ...job, ...updatedJob });
                        }}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <IconButton key={`tp-row-${index}`} onClick={event=>{
                        let updatedJob = JSON.parse(JSON.stringify(job));
                        updatedJob.text_prompts.splice(index,0,"New Prompt:1")
                        setJob({ ...job, ...updatedJob });
                      }}
                        colorScheme='green'
                        aria-label='Add'
                        icon={<AddIcon />}
                      />
                      <IconButton onClick={event=>{
                        let updatedJob = JSON.parse(JSON.stringify(job));
                        updatedJob.text_prompts.splice(index,1)
                        setJob({ ...job, ...updatedJob });
                      }}
                      colorScheme='red'
                      aria-label='Remove'
                      icon={<DeleteIcon />}
                      />
                      {/* <FormHelperText>Weight</FormHelperText> */}
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor={`tp-text-${index}`}>Text</FormLabel>
                      <Textarea
                        id={`tp-text-${index}`}
                        type="text"
                        value={text}
                        onChange={(event) => {
                          let updatedJob = JSON.parse(JSON.stringify(job));
                          let a = updatedJob.text_prompts[index].split(":")
                          let weight = 1
                          if(a.length>1) weight = a[a.length-1]
                          updatedJob.text_prompts[index] = `${event.target.value}:${weight}`;
                          setJob({ ...job, ...updatedJob });
                        }}
                      />
                      {/* <FormHelperText>Text</FormHelperText> */}
                    </FormControl>
                  </SimpleGrid>
                })
              }
              {show_help && <FormHelperText>
                Phrase, sentence, or string of words and phrases describing what the image should look like.  The words will be analyzed by the AI and will guide the diffusion process toward the image you describe.
                These can include multiple prompts with different weights to adjust the relative importance of each element.
                E.g:<br />
                <p><Code variant={"outline"} p={5} mt={5} mb={5} rounded={"md"}>"A beautiful painting of a singular lighthouse, shining its light across a tumultuous sea of blood by greg rutkowski and thomas kinkade, Trending on artstation."</Code></p>
                Notice that this prompt loosely follows a structure:
                <p><Code variant={"outline"} p={5} mt={5} mb={5} rounded={"md"}>[subject], [prepositional details], [setting], [meta modifiers and artist]</Code></p>
                This is a good starting point for your experiments.   Writing prompts is an art in and of itself, browse around the site to get inspired!
              </FormHelperText>}
            </FormControl>
            <SimpleGrid columns={{sm: 1, md: 3}} spacing="20px">
              <FormControl>
                <FormLabel htmlFor="seed">Image Seed</FormLabel>
                <NumberInput
                  id="seed"
                  defaultValue={-1}
                  value={job.seed}
                  min={-1}
                  max={2 ** 32}
                  clampValueOnBlur={true}
                  onChange={(value) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.seed = parseInt(value);
                    updatedJob.set_seed = parseInt(value);
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
                <NumberInput
                  id="steps"
                  defaultValue={job.steps}
                  min={20}
                  max={500}
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
                <FormLabel htmlFor="skip_steps">Skip Steps</FormLabel>
                <NumberInput
                  id="skip_steps"
                  value={job.skip_steps}
                  defaultValue={0}
                  min={0}
                  max={1000}
                  clampValueOnBlur={true}
                  onChange={(value) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.skip_steps = parseInt(value);
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
                  The first few steps of denoising are often so dramatic that some steps (maybe 10-15% of total) can be skipped without affecting the final image. You can experiment with this as a way to cut render times.
                </FormHelperText>}
              </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={{sm: 2, md: 2}} spacing="20px">
                <FormControl>
                  <FormLabel htmlFor="aspect_ratio">Aspect Ratio Presets</FormLabel>
                  <Select id = "aspect_ratio" value={job.aspect_ratio} placeholder='Select an aspect ratio...' onChange={(event) => {
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
                    {show_help && <FormHelperText>Shape presets to apply to width/height.  Height will be calculated on aspect ratio based on width.</FormHelperText>}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="lock_ratio">Lock Aspect Ratio</FormLabel>
                  <Switch
                    id="lock_ratio"
                    isChecked={(job.lock_ratio==="yes"||job.lock_ratio===true)?true:false}
                    isDisabled={job.aspect_ratio==="free"}
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
                  <NumberInput
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
                  <NumberInput
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
              <SimpleGrid columns={{sm: 1, md: 3}} spacing="20px">
                <FormControl>
                  <FormLabel htmlFor="diffusion_model">Diffusion Model</FormLabel>
                  <Select placeholder='Select Diffusion Model' value={job.diffusion_model} onChange={(event) => {
                      let updatedJob = JSON.parse(JSON.stringify(job));
                      let value = event.target.selectedOptions[0].value;
                      updatedJob.diffusion_model = value;
                      setJob({ ...job, ...updatedJob });
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
                        {"key" : "IsometricDiffusionRevrart512px", "text" : "IsometricDiffusionRevrart512px"}
                      ].map(diffusion_model=>{
                        return <option value={diffusion_model.key}>{diffusion_model.text}</option>
                      })
                    }
                  </Select>
                  {show_help && <FormHelperText>Diffusion_model of choice.  Each model has its own "flavor".  Try them all to see what works for you.</FormHelperText>}
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="use_secondary_model">Use Secondary Model</FormLabel>
                  <Switch
                    id="use_secondary_model"
                    isChecked={job.use_secondary_model}
                    onChange={(event) => {
                      let updatedJob = JSON.parse(JSON.stringify(job));
                      updatedJob.use_secondary_model = event.target.checked ? true : false;
                      setJob({ ...job, ...updatedJob });
                    }}
                  />
                  {show_help && <FormHelperText>Option to use a secondary purpose-made diffusion model to clean up interim diffusion images for CLIP evaluation.
                    If this option is turned off, DD will use the regular (large) diffusion model.  Using the secondary model is faster - one user reported a 50% improvement in render speed!
                    However, the secondary model is much smaller, and may reduce image quality and detail.  I suggest you experiment with this.
                  </FormHelperText>}
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="diffusion_sampling_mode">Diffusion Sampling Mode</FormLabel>
                  <RadioGroup
                    value={(job.diffusion_sampling_mode!==undefined)?job.diffusion_sampling_mode:(job.discoart_tags)?job.discoart_tags.diffusion_sampling_mode:"ddim"}
                    onChange={(value) => {
                      let updatedJob = JSON.parse(JSON.stringify(job));
                      updatedJob.diffusion_sampling_mode = value;
                      setJob({ ...job, ...updatedJob });
                    }}
                  >
                    <Radio value="ddim">ddim</Radio>
                    <Radio value="plms">plms</Radio>
                  </RadioGroup>
                  {show_help && <FormHelperText>
                    Two alternate diffusion denoising algorithms. ddim has been around longer, and is more established and tested.  plms is a newly added alternate method that promises good diffusion results in fewer steps, but has not been as fully tested and may have side effects. This new plms mode is actively being researched in the #settings-and-techniques channel in the DD Discord.
                  </FormHelperText>}
                </FormControl>
              </SimpleGrid>
            <SimpleGrid columns={{sm: 1, md: 2}} spacing="20px">
              <FormControl>
                <FormLabel>OpenAI CLIP Models</FormLabel>
                <VStack alignItems={"left"}>
                  {
                    [
                      "ViT-B-16::openai",
                      "ViT-B-32::openai",
                      "RN50::openai",
                      "RN50x4::openai",
                      "RN50x16::openai",
                      "RN50x64::openai",
                      "RN101::openai",
                      "ViT-L-14::openai",
                      "ViT-L-14-336::openai",
                      "RN50-quickgelu::openai",
                      "ViT-B-32-quickgelu::openai"
                    ].map(clipmodel=>{
                      return <Checkbox value = {clipmodel} isChecked={hasClip(clipmodel)} onChange={(event) => {
                        let updatedJob = JSON.parse(JSON.stringify(job));
                        updatedJob.clip_models = updateClip(event.target.value, event.target.checked)
                        setJob({ ...job, ...updatedJob });
                      }}>{clipmodel}</Checkbox>
                    })
                  }
                </VStack>
              </FormControl>
              <FormControl>
                <FormLabel>Additional CLIP Models</FormLabel>
                <VStack alignItems={"left"}>
                  {
                    [
                      "RN50::yfcc15m",
                      "RN50::cc12m",
                      "RN50-quickgelu::yfcc15m",
                      "RN50-quickgelu::cc12m",
                      "RN101::yfcc15m",
                      "RN101-quickgelu::yfcc15m",
                      "ViT-B-32::laion2b_e16",
                      "ViT-B-32::laion400m_e31",
                      "ViT-B-32::laion400m_e32",
                      "ViT-B-32-quickgelu::laion400m_e31",
                      "ViT-B-32-quickgelu::laion400m_e32",
                      "ViT-B-16::laion400m_e31",
                      "ViT-B-16::laion400m_e32",
                      "ViT-B-16-plus-240::laion400m_e31",
                      "ViT-B-16-plus-240::laion400m_e32",
                      "ViT-L-14::laion400m_e31",
                      "ViT-L-14::laion400m_e32"
                    ].map(clipmodel=>{
                      return <Checkbox value = {clipmodel} isChecked={hasClip(clipmodel)} onChange={(event) => {
                        let updatedJob = JSON.parse(JSON.stringify(job));
                        updatedJob.clip_models = updateClip(event.target.value, event.target.checked)
                        setJob({ ...job, ...updatedJob });
                      }}>{clipmodel}</Checkbox>
                    })
                  }
                </VStack>
              </FormControl>
            </SimpleGrid>
            <SimpleGrid columns={{sm: 2, md: 2}} spacing="20px">
              <FormControl>
                <FormLabel htmlFor="cutn_batches">Number of Cut Batches</FormLabel>
                <NumberInput
                  id="cutn_batches"
                  step={1}
                  precision={0}
                  defaultValue={job.cutn_batches}
                  min={0}
                  max={8}
                  onChange={(value) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.cutn_batches = parseFloat(value);
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
                  Each iteration, the AI cuts the image into smaller pieces known as cuts, and compares each cut to the prompt to decide how to guide the next diffusion step.  
                  More cuts can generally lead to better images, since DD has more chances to fine-tune the image precision in each timestep.  
                  Additional cuts are memory intensive, however, and if DD tries to evaluate too many cuts at once, it can run out of memory.  
                  You can use cutn_batches to increase cuts per timestep without increasing memory usage. 
                  At the default settings, DD is scheduled to do 16 cuts per timestep.  If cutn_batches is set to 1, there will indeed only be 16 cuts total per timestep. 
                  However, if cutn_batches is increased to 4, DD will do 64 cuts total in each timestep, divided into 4 sequential batches of 16 cuts each.
                  Because the cuts are being evaluated only 16 at a time, DD uses the memory required for only 16 cuts, but gives you the quality benefit of 64 cuts.
                  The tradeoff, of course, is that this will take ~4 times as long to render each image.
                  So, (scheduled cuts) x (cutn_batches) = (total cuts per timestep). Increasing cutn_batches will increase render times, however, as the work is being done sequentially.
                  DD's default cut schedule is a good place to start, but the cut schedule can be adjusted with cut scheduling parameters.
                </FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="clip_guidance_scale">
                  CLIP Guidance Scale
                </FormLabel>
                <NumberInput
                  id="clip_guidance_scale"
                  defaultValue={job.clip_guidance_scale}
                  min={1500}
                  max={100000}
                  onChange={(value) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.clip_guidance_scale = parseInt(value);
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
                  CGS is one of the most important parameters you will use. It tells DD how strongly you want CLIP to move toward your prompt each timestep.
                  Higher is generally better, but if CGS is too strong it will overshoot the goal and distort the image. So a happy medium is needed, and it takes experience to learn how to adjust CGS.
                </FormHelperText>}
              </FormControl>
            </SimpleGrid>
            <FormControl>
              <FormLabel htmlFor="cut_overview">Cut Overview (cut_overview)</FormLabel>
              <Input value={job.cut_overview} onChange={(event) => {
                  let value = event.currentTarget.value
                  let updatedJob = JSON.parse(JSON.stringify(job));
                  updatedJob.cut_overview = value;
                  setJob({ ...job, ...updatedJob });
                }}/>
              {show_help && <FormHelperText>The schedule of overview cuts, which take a snapshot of the entire image and evaluate that against the prompt.</FormHelperText>}
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="cut_ic_pow">Cut Innercut Power (cut_ic_pow)</FormLabel>
                <Input value={job.cut_ic_pow} onChange={(event) => {
                    let value = event.currentTarget.value
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.cut_ic_pow = value;
                    setJob({ ...job, ...updatedJob });
                  }}/>
                {show_help && <FormHelperText>This sets the size of the border used for inner cuts.  High cut_ic_pow values have larger borders, and therefore the cuts themselves will be smaller and provide finer details. 
                  If you have too many or too-small inner cuts, you may lose overall image coherency and/or it may cause an undesirable mosaic effect.
                  Low cut_ic_pow values will allow the inner cuts to be larger, helping image coherency while still helping with some details.
                  This can be a list of floats that represents the value at different steps, the syntax follows the same as cut_overview.</FormHelperText>}
              </FormControl>
            <FormControl>
              <FormLabel htmlFor="cut_innercut">Cut Innercut (cut_innercut)</FormLabel>
              <Input value={job.cut_innercut} onChange={(event) => {
                  let value = event.currentTarget.value
                  let updatedJob = JSON.parse(JSON.stringify(job));
                  updatedJob.cut_innercut = value;
                  setJob({ ...job, ...updatedJob });
                }}/>
              {show_help && <FormHelperText>The schedule of inner cuts, which are smaller cropped images from the interior of the image, helpful in tuning fine details. The size of the inner cuts can be adjusted using the `cut_ic_pow` parameter.</FormHelperText>}
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="cut_icgray_p">Cut Innercut Gray Percent (cut_icgray_p)</FormLabel>
              <Input value={job.cut_icgray_p} onChange={(event) => {
                  let value = event.currentTarget.value
                  let updatedJob = JSON.parse(JSON.stringify(job));
                  updatedJob.cut_icgray_p = value;
                  setJob({ ...job, ...updatedJob });
                }}/>
              {show_help && <FormHelperText>In addition to the overall cut schedule, a portion of the cuts can be set to be grayscale instead of color. This may help with improved definition of shapes and edges, especially in the early diffusion steps where the image structure is being defined.</FormHelperText>}
            </FormControl>
            <SimpleGrid columns={{sm: 1, md: 2}} spacing="20px">
            <FormControl>
              <FormLabel htmlFor="range_scale">Range Scale</FormLabel>
              <NumberInput
                id="range_scale"
                step={1}
                precision={0}
                defaultValue={job.range_scale}
                value={job.range_scale}
                min={0.01}
                max={100}
                onChange={(value) => {
                  let updatedJob = JSON.parse(JSON.stringify(job));
                  updatedJob.range_scale = parseFloat(value);
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
                Optional, set to zero to turn off.  Used for adjustment of color contrast.  Lower range_scale will increase contrast. Very low numbers create a reduced color palette, resulting in more vibrant or poster-like images. Higher range_scale will reduce contrast, for more muted images.  
              </FormHelperText>}
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="sat_scale">Saturation Scale</FormLabel>
              <NumberInput
                id="sat_scale"
                step={0.1}
                precision={0}
                defaultValue={0}
                value={job.sat_scale}
                min={0.01}
                max={100}
                onChange={(value) => {
                  let updatedJob = JSON.parse(JSON.stringify(job));
                  updatedJob.sat_scale = parseFloat(value);
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
                Optional, set to zero to turn off. If used, sat_scale will help mitigate oversaturation. If your image is too saturated, increase sat_scale to reduce the saturation.
              </FormHelperText>}
            </FormControl>
            </SimpleGrid>
            <SimpleGrid columns={{sm: 1, md: 2}} spacing="20px">
              <FormControl>
                <FormLabel htmlFor="clamp_grad">Clamp Grad</FormLabel>
                <Switch
                  id="clamp_grad"
                  isChecked={job.clamp_grad}
                  onChange={(event) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.clamp_grad = event.target.checked ? true: false
                    setJob({ ...job, ...updatedJob });
                  }}
                />
                {show_help && <FormHelperText>
                  As I understand it, clamp_grad is an internal limiter that stops DD from producing extreme results.
                  Try your images with and without clamp_grad. If the image changes drastically with clamp_grad turned off, it probably means your clip_guidance_scale is too high and should be reduced.
                </FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="clamp_max">Clamp Max</FormLabel>
                <NumberInput
                  id="clamp_max"
                  step={0.05}
                  precision={2}
                  defaultValue={0.05}
                  value={job.clamp_max}
                  min={0.0}
                  max={10000}
                  onChange={(value) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.clamp_max = parseFloat(value);
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
                  Sets the value of the clamp_grad limitation. Default is 0.05, providing for smoother, more muted coloration in images, but setting higher values (0.15-0.3) can provide interesting contrast and vibrancy.
                  Can be scheduled via syntax `[val1]*400+[val2]*600`.
                </FormHelperText>}
              </FormControl>
            </SimpleGrid>
            <FormControl>
              <FormLabel htmlFor="eta">ETA</FormLabel>
              <NumberInput
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
                eta (greek letter η) is a diffusion model variable that mixes in a random amount of scaled noise into each timestep. 0 is no noise, 1.0 is more noise.
                As with most DD parameters, you can go below zero for eta, but it may give you unpredictable results. 
                The steps parameter has a close relationship with the eta parameter. If you set eta to 0, then you can get decent output with only 50-75 steps.
                Setting eta to 1.0 favors higher step counts, ideally around 250 and up. eta has a subtle, unpredictable effect on image, so you'll need to experiment to see how this affects your projects.
              </FormHelperText>}
            </FormControl>
            <SimpleGrid columns={{sm: 1, md: 2}} spacing="20px">
              <FormControl>
                <FormLabel htmlFor="use_horizontal_symmetry">Horizontal Symmetry</FormLabel>
                <Switch
                  id="use_horizontal_symmetry"
                  isChecked={job.use_horizontal_symmetry}
                  onChange={(event) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.use_horizontal_symmetry = event.target.checked ? true: false
                    setJob({ ...job, ...updatedJob });
                  }}
                />
                {show_help && <FormHelperText>Enforce symmetry over x axis of the image on [tr_ststeps for tr_st in transformation_steps] steps of the diffusion process</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="use_vertical_symmetry">Vertical Symmetry</FormLabel>
                <Switch
                  id="use_vertical_symmetry"
                  isChecked={job.use_vertical_symmetry}
                  onChange={(event) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.use_vertical_symmetry = event.target.checked ? true: false
                    setJob({ ...job, ...updatedJob });
                  }}
                />
                {show_help && <FormHelperText>Enforce symmetry over y axis of the image on [tr_ststeps for tr_st in transformation_steps] steps of the diffusion process</FormHelperText>}
              </FormControl>
            </SimpleGrid>
            <FormControl>
              <FormLabel htmlFor="transformation_percent">
                Transformation Percent
              </FormLabel>
              <Input value={JSON.stringify(job.transformation_percent)} onChange={(event) => {
                  let value = event.currentTarget.value
                  let updatedJob = JSON.parse(JSON.stringify(job));
                  updatedJob.transformation_percent = JSON.parse(value);
                  setJob({ ...job, ...updatedJob });
                }}/>
              {show_help && <FormHelperText>Steps expressed in percentages in which the symmetry is enforced</FormHelperText>}
            </FormControl>
            <SimpleGrid columns={{sm: 2, md: 2, lg:4}} spacing="20px">
              <FormControl>
                <FormLabel htmlFor="randomize_class">Randomize Class</FormLabel>
                <Switch
                  id="randomize_class"
                  isChecked={job.randomize_class}
                  onChange={(event) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.randomize_class = event.target.checked ? true : false;
                    setJob({ ...job, ...updatedJob });
                  }}
                />
                {show_help && <FormHelperText>Controls whether the imagenet class is randomly changed each iteration</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="skip_augs">Skip Augs</FormLabel>
                <Switch
                  id="skip_augs"
                  checked={job.skip_augs}
                  onChange={(event) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.skip_augs = event.target.checked ? true : false;
                    setJob({ ...job, ...updatedJob });
                  }}
                />
                {show_help && <FormHelperText>Controls whether to skip torchvision augmentations.</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="clip_denoised">CLIP Denoised</FormLabel>
                <Switch
                  id="clip_denoised"
                  isChecked={job.clip_denoised}
                  onChange={(event) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.clip_denoised = event.target.checked ? true : false;
                    setJob({ ...job, ...updatedJob });
                  }}
                />
                {show_help && <FormHelperText>Determines whether CLIP discriminates a noisy or denoised image</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="fuzzy_prompt">Fuzzy Prompt</FormLabel>
                <Switch
                  id="fuzzy_prompt"
                  isChecked={job.fuzzy_prompt}
                  onChange={(event) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.fuzzy_prompt = event.target.checked ? true : false;
                    setJob({ ...job, ...updatedJob });
                  }}
                />
                {show_help && <FormHelperText>Controls whether to add multiple noisy prompts to the prompt losses. If True, can increase variability of image output. Experiment with this.</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="nsfw">NSFW?</FormLabel>
                <Switch
                  id="nsfw"
                  isChecked={(job.nsfw==="yes"||job.nsfw===true)?true:false}
                  onChange={(event) => {
                    let updatedJob = JSON.parse(JSON.stringify(job));
                    updatedJob.nsfw = event.target.checked ? true : false;
                    setJob({ ...job, ...updatedJob });
                  }}
                />
                {show_help && <FormHelperText>Flag as NSFW. This does NOT mean you can render illegal or sexuallyexplicit content</FormHelperText>}
              </FormControl>
            </SimpleGrid>
            <Button onClick={submitMutate}>Mutate</Button>
          </Skeleton>
        </Box>
      </Center>
    </>
  );
}

export default MutatePage;
