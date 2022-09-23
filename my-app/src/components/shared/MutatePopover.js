import React from 'react';
import { useState, useEffect } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

import {
  Box,
  Heading,
  Link,
  Image,
  IconButton,
  Text,
  Flex,
  Divider,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  SpaceProps,
  useColorModeValue,
  Container,
  Code,
  VStack,
  Button,
  SimpleGrid,
  useToast,
  Switch,
  FormControl,
  FormLabel,
  FormHelperText,
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  Input,
  Textarea,
  ButtonGroup,
  Select,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from '@chakra-ui/react';

import { VscSettings } from 'react-icons/vsc';
import { BsDice3 } from 'react-icons/bs';

export function MutatePopover(props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  let data = props.piece
  let token = props.token
  const toast = useToast()
  const [piece, setPiece] = useState(data)
  const [isLoading, setIsLoading] = useState(false)

  async function save() {
    try {
      // return
      setIsLoading(true)
      let j = JSON.parse(JSON.stringify(piece))
      j.batch_size = 1
      console.log(j)
      const { success: mutateSuccess, results: results } = await fetch(
        `${process.env.REACT_APP_api_url}/v3/create/mutate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ job: j }),
        }
      )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        toast({
          title: "Job Received"
        })
        onClose()
        return data;
      });

      if (mutateSuccess) {
        // if(mode==="mutate"){
        //   if(results){
        //     // console.log(results)
        //     navigate(`/myreviews/1`);
        //   }
        // }
        // if(mode==="edit"){
        //   navigate(`/piece/${results[0].uuid}`);
        // }
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Unable to mutate.');
    }
  }

  return (
    <>
    <IconButton
      // style={{
      //   position : "absolute",
      //   top : 0,
      //   left : 0,
      //   zIndex : 2
      // }}
      isRound
      isDisabled={isLoading}
      colorScheme={'blue'}
      size="md"
      onClick={onOpen}
      icon={<VscSettings />}
    />
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay bg='none'
          backdropFilter='auto'
          backdropInvert='10%'
          backdropBlur='10px'/>
        <ModalContent>
          <ModalHeader>Mutate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              borderRadius="lg"
              src={`http://images.feverdreams.app/thumbs/512/${piece.preferredImage || piece.uuid}.jpg`}
              alt={piece.uuid}
              objectFit="contain"
            />
            <FormControl>
                <FormLabel htmlFor="prompt">Prompt</FormLabel>
                <Textarea
                  id={`prompt`}
                  type="text"
                  value={piece.params.prompt}
                  onChange={(event) => {
                    let prompt = event.target.value
                    console.log(prompt)
                    let updatedPiece = JSON.parse(JSON.stringify(piece));
                    updatedPiece.params.prompt = prompt;
                    setPiece({ ...piece, ...updatedPiece });
                  }}
                />
            </FormControl>
            <Wrap>
              <WrapItem>
                <FormControl>
                  <FormLabel htmlFor="sampler">Sampler</FormLabel>
                  <Select id = "sampler" value={piece.params.sampler} onChange={(event) => {
                      // let updatedJob = JSON.parse(JSON.stringify(job));
                      // let value = event.target.selectedOptions[0].value;
                      // updatedJob.params.sampler = value
                      // setJob({ ...job, ...updatedJob });
                    }}>
                    {
                      [
                        {"key" : "k_lms", "text" : "k_lms"},
                        {"key" : "ddim", "text" : "ddim"},
                        {"key" : "plms", "text" : "plms"},
                        {"key" : "k_euler", "text" : "k_euler"},
                        {"key" : "k_euler_ancestral", "text" : "k_euler_ancestral"},
                        {"key" : "k_heun", "text" : "k_heun"},
                        {"key" : "k_dpm_2", "text" : "k_dpm_2"},
                        {"key" : "k_dpm_2_ancestral", "text" : "k_dpm_2_ancestral"},
                      ].map(shape=>{
                        return <option value={shape.key}>{shape.text}</option>
                      })
                    }
                  </Select>
                </FormControl>
              </WrapItem>
              <WrapItem>
                <FormControl>
                    <FormLabel htmlFor="seed">Image Seed</FormLabel>
                    <HStack>
                    <NumberInput
                      id="seed"
                      value={piece.params.seed}
                      min={-1}
                      max={2 ** 32}
                      clampValueOnBlur={true}
                      onChange={(value) => {
                        // let updatedJob = JSON.parse(JSON.stringify(job));
                        // updatedJob.params.seed = parseInt(value);
                        // setJob({ ...job, ...updatedJob });
                      }}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <IconButton
                      isRound
                      variant={"ghost"}
                      // colorScheme={'blue'}
                      size="md"
                      onClick={() => {
                        let updatedPiece = JSON.parse(JSON.stringify(piece))
                        let r = Math.floor(Math.random() * (2**32))
                        updatedPiece.params.seed = parseInt(r)
                        setPiece({ ...piece, ...updatedPiece })
                      }}
                      // ml={1}
                      icon={<BsDice3 />}
                    ></IconButton>
                    </HStack>
                  </FormControl>
                  </WrapItem>
              </Wrap>
              <Wrap>
                <WrapItem>
                  <FormControl>
                  <FormLabel htmlFor="steps">Steps</FormLabel>
                  <NumberInput
                    id="steps"
                    value={piece.params.steps}
                    min={10}
                    max={150}
                    clampValueOnBlur={true}
                    onChange={(value) => {
                      // let updatedJob = JSON.parse(JSON.stringify(job));
                      // updatedJob.params.steps = parseInt(value);
                      // setJob({ ...job, ...updatedJob });
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  </FormControl>
                </WrapItem>
                <WrapItem>
                  <FormControl>
                  <FormLabel htmlFor="scale">
                    Scale
                  </FormLabel>
                  <NumberInput
                    id="scale"
                    value={piece.params.scale}
                    precision={2}
                    step={0.1}
                    min={1}
                    max={15}
                    onChange={(value) => {
                      // let updatedJob = JSON.parse(JSON.stringify(job));
                      // updatedJob.params.scale = parseFloat(value);
                      // setJob({ ...job, ...updatedJob });
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                </WrapItem>
                <WrapItem>
                  <FormControl>
                    <FormLabel htmlFor="width">Width</FormLabel>
                    <NumberInput
                      id="width"
                      step={64}
                      value={piece.params.width_height?piece.params.width_height[0]:1280}
                      min={128}
                      max={2560}
                      clampValueOnBlur={true}
                      onChange={(value) => {
                        let updatedPiece = JSON.parse(JSON.stringify(piece))
                        updatedPiece.params.width_height[0] = parseInt(value)
                        setPiece({ ...piece, ...updatedPiece });
                      }}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </WrapItem>
                <WrapItem>
                  <FormControl>
                    <FormLabel htmlFor="height">Height</FormLabel>
                    <NumberInput
                      id="height"
                      step={64}
                      value={piece.params.width_height?piece.params.width_height[1]:768}
                      min={128}
                      max={2560}
                      clampValueOnBlur={true}
                      onChange={(value) => {
                        let updatedPiece = JSON.parse(JSON.stringify(piece))
                        updatedPiece.params.width_height[1] = parseInt(value)
                        setPiece({ ...piece, ...updatedPiece });
                      }}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </WrapItem>
                <WrapItem>
                  <FormControl>
                  <FormLabel htmlFor="eta">ETA</FormLabel>
                  <NumberInput
                    id="eta"
                    step={0.1}
                    precision={2}
                    value={piece.params.eta}
                    min={0.0}
                    max={10}
                    onChange={(value) => {
                      // let updatedJob = JSON.parse(JSON.stringify(job));
                      // updatedJob.params.eta = parseFloat(value);
                      // setJob({ ...job, ...updatedJob });
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                </WrapItem>
              </Wrap>
              <Wrap>
              </Wrap>
              </ModalBody>

          <ModalFooter>
            <Button variant='ghost' colorScheme='red' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme={"blue"} onClick={save}>Go</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
