import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Heading,
  Image,
  Skeleton,
  Text,
  Textarea,
  FormControl,
  FormHelperText,
  FormLabel,
  NumberDecrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  RadioGroup,
  Radio,
  Stack,
  Switch,
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

// TODO: This isAuthenticated/token stuff should be in a context <- Agreed, -Mike.
function MutatePage({ isAuthenticated, token }) {
  const [job, setJob] = useState({});
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
      setLoading(true);
      console.log(job)
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
          console.log(data);
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

  return (
    <>
      <Skeleton isLoaded={!loading}>
        <Heading size={"md"}>Mutate: {job ? job.uuid : 'Loading'}</Heading>
        <Image src={`https://images.feverdreams.app/thumbs/512/${job.uuid}.jpg`}></Image>
        <FormControl>
          <FormLabel htmlFor="experimental">🧪 Experimental Mode</FormLabel>
          <Switch
            id="experimental"
            onChange={(event) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.experimental = event.target.checked ? true : false;
              setJob({ ...job, ...updatedJob });
            }}
          />
          <FormHelperText>Opt-in for experimental new GPU agent mode.  Jobs may take longer to be taken, may fail, or might be better!</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="text_prompt">Text Prompt</FormLabel>
          <Textarea
            id="text_prompt"
            type="text"
            value={job.text_prompt}
            onChange={(event) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.text_prompt = event.target.value;
              setJob({ ...job, ...updatedJob });
            }}
          />
          <FormHelperText>
            In Disco Diffusion, text prompts can be a few words, a long
            sentence, or a few sentences. Writing prompts is an art in and of
            itself, browse around the site to get inspired!
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="set_seed">Image Seed</FormLabel>
          <NumberInput
            id="set_seed"
            defaultValue={job.set_seed || -1}
            min={-1}
            max={2 ** 32}
            w="200px"
            clampValueOnBlur={true}
            onChange={(value) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
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
          <FormHelperText>
            Image seed used during rendering. Specify -1 for a random seed.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="steps">Steps</FormLabel>
          <NumberInput
            id="steps"
            defaultValue={job.steps}
            min={20}
            max={500}
            w="100px"
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
          <FormHelperText>
            Increasing steps will provide more opportunities for the AI to
            adjust the image, and each adjustment will be smaller, and thus will
            yield a more precise, detailed image. Increasing steps comes at the
            expense of longer render times.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="model">CLIP Model Combo</FormLabel>
          <RadioGroup
            // onChange={setValue}
            value={job.model}
            onChange={(value) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.model = value;
              setJob({ ...job, ...updatedJob });
            }}
          >
            <Stack direction="row">
              <Radio value="default">Default (ViTB16+32, RN50)</Radio>
              <Radio value="rn50x64">ViTB16+32, RN50x64</Radio>
              <Radio value="vitl14">ViTB16+32, ViTL14</Radio>
              <Radio value="vitl14x336">ViTB16+32, ViTL14x336</Radio>
              <Radio value="ludicrous">RN50x64 and ViTL14x336</Radio>
            </Stack>
          </RadioGroup>
          {/* <FormHelperText></FormHelperText> */}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="diffusion_model">Diffusion Model</FormLabel>
          <RadioGroup
            // onChange={setValue}
            value={job.diffusion_model}
            onChange={(value) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.diffusion_model = value;
              setJob({ ...job, ...updatedJob });
            }}
          >
            <Stack direction="row">
              <Radio value="512x512_diffusion_uncond_finetune_008100">
                512x512_diffusion_uncond_finetune_008100
              </Radio>
              <Radio value="256x256_diffusion_uncond">
                256x256_diffusion_uncond
              </Radio>
              <Radio value="portrait_generator_v001_ema_0.9999_1MM">
                portrait_generator_v001_ema_0.9999_1MM
              </Radio>
              {/* <Radio value="pixel_art_diffusion_hard_256">
                pixel_art_diffusion_hard_256
              </Radio>
              <Radio value="pixel_art_diffusion_soft_256">
                pixel_art_diffusion_soft_256
              </Radio>
              <Radio value="256x256_openai_comics_faces_v2.by_alex_spirin_114k">
                256x256_openai_comics_faces_v2.by_alex_spirin_114k
              </Radio>
              <Radio value="lsun_uncond_100M_1200K_bs128">
                lsun_uncond_100M_1200K_bs128
              </Radio> */}
            </Stack>
          </RadioGroup>
          <FormHelperText>🧪 Experimental feature</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="cutn_batches">Number of Cut Batches</FormLabel>
          <RadioGroup
            // onChange={setValue}
            value={job.cutn_batches}
            onChange={(value) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.cutn_batches = parseInt(value);
              setJob({ ...job, ...updatedJob });
            }}
          >
            <Stack direction="row">
              <Radio value={2}>2</Radio>
              <Radio value={4}>4</Radio>
              <Radio value={8}>8</Radio>
            </Stack>
          </RadioGroup>
          <FormHelperText>
            Additional cuts are memory intensive. You can use "cutn_batches" to
            increase cuts per timestep without increasing memory usage.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="shape">Image Shape</FormLabel>
          <RadioGroup
            // onChange={setValue}
            value={job.shape}
            onChange={(value) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.shape = value;
              setJob({ ...job, ...updatedJob });
            }}
          >
            <Stack direction="row">
              <Radio value="landscape">Landscape</Radio>
              <Radio value="portait">Portait</Radio>
              <Radio value="square">Square</Radio>
              <Radio value="pano">Panoramic</Radio>
              <Radio value="skyscraper">Skyscraper</Radio>
              <Radio value="tinysquare">Tiny Square</Radio>
            </Stack>
          </RadioGroup>
          <FormHelperText>
            Various shapes are available in this mutator. For more advanced
            resolution options, use the Incubator.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="cut_schedule">Cut Schedule</FormLabel>
          <RadioGroup
            // onChange={setValue}
            value={job.cut_schedule}
            onChange={(value) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.cut_schedule = value;
              setJob({ ...job, ...updatedJob });
            }}
          >
            <Stack direction="row">
              <Radio value="default">Default</Radio>
              <Radio value="detailed-a">Detailed-A</Radio>
              <Radio value="detailed-b">Detailed-B</Radio>
              <Radio value="ram-efficient">RAM-Efficient</Radio>
              <Radio value="potato">Potato</Radio>
            </Stack>
          </RadioGroup>
          {/* <FormHelperText></FormHelperText> */}
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
            w="100px"
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
          <FormHelperText>
            CGS is one of the most important parameters you will use. It tells
            DD how strongly you want CLIP to move toward your prompt each
            timestep. Higher is generally better, but if CGS is too strong it
            will overshoot the goal and distort the image. So a happy medium is
            needed, and it takes experience to learn how to adjust CGS.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="cut_ic_pow">Inner Cut Power</FormLabel>
          <NumberInput
            id="cut_ic_pow"
            step={0.1}
            precision={2}
            defaultValue={job.cut_ic_pow}
            min={0.01}
            max={100}
            w="100px"
            onChange={(value) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.cut_ic_pow = parseFloat(value);
              setJob({ ...job, ...updatedJob });
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>
            This sets the size of the border used for inner cuts. High
            cut_ic_pow values have larger borders, and therefore the cuts
            themselves will be smaller and provide finer details.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="sat_scale">Saturation Scale</FormLabel>
          <NumberInput
            id="sat_scale"
            step={1}
            precision={0}
            defaultValue={job.sat_scale}
            min={0.01}
            max={100}
            w="100px"
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
          <FormHelperText>
            Optional, set to zero to turn off. If used, sat_scale will help
            mitigate oversaturation. If your image is too saturated, increase
            sat_scale to reduce the saturation.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="clamp_max">Clamp Max</FormLabel>
          <NumberInput
            id="clamp_max"
            step={1}
            precision={0}
            defaultValue={job.clamp_max}
            min={0}
            max={10000}
            w="100px"
            onChange={(value) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.clamp_max = parseInt(value);
              setJob({ ...job, ...updatedJob });
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {/* <FormHelperText></FormHelperText> */}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="eta">ETA</FormLabel>
          <NumberInput
            id="eta"
            step={0.1}
            precision={2}
            defaultValue={job.eta}
            min={0.01}
            max={10}
            w="100px"
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
          {/* <FormHelperText></FormHelperText> */}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="symmetry">Symmetry?</FormLabel>
          <Switch
            id="symmetry"
            onChange={(event) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.symmetry = event.target.checked ? 'yes' : 'no';
              setJob({ ...job, ...updatedJob });
            }}
          />
          <FormHelperText>Use Horizontal Symmetry</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="symmetry_loss_scale">
            Symmetry Loss Scale
          </FormLabel>
          <NumberInput
            id="symmetry_loss_scale"
            defaultValue={job.symmetry_loss_scale}
            min={0}
            max={100000}
            w="100px"
            onChange={(value) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.symmetry_loss_scale = parseInt(value);
              setJob({ ...job, ...updatedJob });
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {/* <FormHelperText></FormHelperText> */}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="nsfw">NSFW?</FormLabel>
          <Switch
            id="nsfw"
            onChange={(event) => {
              let updatedJob = JSON.parse(JSON.stringify(job));
              updatedJob.nsfw = event.target.checked ? 'yes' : 'no';
              setJob({ ...job, ...updatedJob });
            }}
          />
          <FormHelperText>
            Flag as NSFW. This does NOT mean you can render illegal or sexually
            explicit content
          </FormHelperText>
        </FormControl>
        <Button onClick={submitMutate}>Mutate</Button>
      </Skeleton>
    </>
  );
}

export default MutatePage;
