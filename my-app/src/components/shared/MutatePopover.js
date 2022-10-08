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
  const [dataCopy, setDataCopy] = useState(data)
  const [isLoading, setIsLoading] = useState(false)
  let bs = localStorage.getItem("batchsize-settings");
  let batch_size = bs?parseInt(bs):5
  const [batchSize, setBatchSize] = useState(batch_size);
  // useEffect(() => {
  //   setPiece(props.piece)
  // }, [props.piece]);

  async function save() {
    try {
      // return
      setIsLoading(true)
      let j = JSON.parse(JSON.stringify(dataCopy))
      j.batch_size = batchSize
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
      onClick={()=>{
        setDataCopy(JSON.parse(JSON.stringify(piece)))
        onOpen()
      }}
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
              src={`http://images.feverdreams.app/thumbs/512/${dataCopy.preferredImage || piece.uuid}.jpg`}
              alt={piece.uuid}
              objectFit="contain"
            />
            <FormControl>
              <FormLabel htmlFor="batch_size">Batch Size</FormLabel>
              <NumberInput
                id="batch_size"
                value={batchSize}
                min={1}
                max={15}
                clampValueOnBlur={true}
                onChange={(value) => {
                  let bs = parseInt(value);
                  localStorage.setItem("batchsize-settings",bs)
                  setBatchSize(bs);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="prompt">Prompt</FormLabel>
                <Textarea
                  id={`prompt`}
                  type="text"
                  value={dataCopy.params.prompt}
                  onChange={(event) => {
                    let prompt = event.target.value
                    let updatedPiece = JSON.parse(JSON.stringify(dataCopy));
                    updatedPiece.params.prompt = prompt;
                    setDataCopy({ ...dataCopy, ...updatedPiece });
                  }}
                />
            </FormControl>
            <Wrap>
              <WrapItem>
                <FormControl>
                  <FormLabel htmlFor="sampler">Sampler</FormLabel>
                  <Select id = "sampler" value={dataCopy.params.sampler} onChange={(event) => {
                      let updatedPiece = JSON.parse(JSON.stringify(dataCopy));
                      let value = event.target.selectedOptions[0].value;
                      updatedPiece.params.sampler = value
                      setDataCopy({ ...dataCopy, ...updatedPiece });
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
                        return <option key = {shape.key} value={shape.key}>{shape.text}</option>
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
                      value={dataCopy.params.seed}
                      min={-1}
                      max={2 ** 32}
                      clampValueOnBlur={true}
                      onChange={(value) => {
                        let updatedPiece = JSON.parse(JSON.stringify(dataCopy));
                        updatedPiece.params.seed = parseInt(value);
                        setDataCopy({ ...dataCopy, ...updatedPiece });
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
                      size="md"
                      onClick={() => {
                        let updatedPiece = JSON.parse(JSON.stringify(dataCopy))
                        let r = Math.floor(Math.random() * (2**32))
                        updatedPiece.params.seed = parseInt(r)
                        setDataCopy({ ...piece, ...updatedPiece })
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
                    value={dataCopy.params.steps}
                    min={10}
                    max={150}
                    clampValueOnBlur={true}
                    onChange={(value) => {
                      let updatedPiece = JSON.parse(JSON.stringify(dataCopy));
                      updatedPiece.params.steps = parseInt(value);
                      setDataCopy({ ...dataCopy, ...updatedPiece });
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
                    value={dataCopy.params.scale}
                    precision={2}
                    step={0.1}
                    min={1}
                    max={15}
                    onChange={(value) => {
                      let updatedPiece = JSON.parse(JSON.stringify(dataCopy));
                      updatedPiece.params.scale = parseFloat(value);
                      setDataCopy({ ...dataCopy, ...updatedPiece });
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
                      value={dataCopy.params.width_height?dataCopy.params.width_height[0]:1280}
                      min={128}
                      max={2560}
                      clampValueOnBlur={true}
                      onChange={(value) => {
                        let updatedPiece = JSON.parse(JSON.stringify(dataCopy))
                        updatedPiece.params.width_height[0] = parseInt(value)
                        setDataCopy({ ...dataCopy, ...updatedPiece });
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
                      value={dataCopy.params.width_height?dataCopy.params.width_height[1]:768}
                      min={128}
                      max={2560}
                      clampValueOnBlur={true}
                      onChange={(value) => {
                        let updatedPiece = JSON.parse(JSON.stringify(dataCopy))
                        updatedPiece.params.width_height[1] = parseInt(value)
                        setDataCopy({ ...dataCopy, ...updatedPiece });
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
                    value={dataCopy.params.eta}
                    min={0.0}
                    max={10}
                    onChange={(value) => {
                      let updatedPiece = JSON.parse(JSON.stringify(dataCopy));
                      updatedPiece.params.eta = parseFloat(value);
                      setDataCopy({ ...dataCopy, ...updatedPiece });
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
