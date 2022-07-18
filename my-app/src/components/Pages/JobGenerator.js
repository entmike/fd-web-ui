import React from "react"
import { useState } from "react"
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Input,
  Text,
  Container,
  VStack,
  IconButton,
  SimpleGrid,
  Heading,
  Textarea,
  NumberInput,
  NumberInputField,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
} from "@chakra-ui/react"

import { useFieldArray, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { CloseIcon, AddIcon } from "@chakra-ui/icons"

import { stateToYaml, yamlToState } from "utils/yamlConversion"
import { inputConfig } from "components/shared/DicoParameters"
import { DynamicInput } from "components/shared/DicoParameters/Inputs"
import mapObject from "utils/mapObject"

// TODO: add real validation schema here
const validationSchema = yup.object({})

// TODO: make linked inputs for better UX
function JobGenerator({ customValidationSchema }) {
  const [exportedYaml, setExportedYaml] = useState()
  const [yamlToImport, setYamlToImport] = useState()
  const { isOpen: exportOpen, onOpen: openExportModal, onClose: closeExportModal } = useDisclosure()
  const { isOpen: importOpen, onOpen: openImportModal, onClose: closeImportModal } = useDisclosure()

  const {
    getValues,
    register,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: mapObject({ valueMapper: (value) => value?.default, mapee: inputConfig }),

    resolver: yupResolver(customValidationSchema || validationSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "text_prompts", // unique name for your Field Array
  })

  const submit = () => {
    // TODO make this do something
    console.log(getValues())
  }

  const importYaml = () => {
    const newState = yamlToState(yamlToImport)
    reset(newState)
    closeImportModal()
  }

  const exportYaml = () => {
    setExportedYaml(stateToYaml(getValues()))
    openExportModal()
  }

  const handlePromptAdd = () => {
    append({
      startFrame: 0,
      prompt: "a lighthouse",
      weight: 1,
    })
  }

  const handlePromptRemove = (index) => () => {
    remove(index)
  }

  return (
    <Container maxWidth="1024px">
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Heading flex="1" textAlign="left" as="h2" fontSize="lg">
                General Settings
              </Heading>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <VStack>
              <Flex width="100%" gap="12px">
                <Text align="center" width="75px">
                  Frame
                </Text>
                <Text align="center" width="75px">
                  Weight
                </Text>
                <Text align="center" flex="1">
                  Prompt
                </Text>
              </Flex>
              {fields.map((field, index) => (
                <Flex width="100%" gap="12px" key={field.id}>
                  <NumberInput width="75px" id={field.id}>
                    <NumberInputField
                      {...register(`text_prompts.${index}.startFrame`)}
                    ></NumberInputField>
                  </NumberInput>
                  <NumberInput width="75px" id={field.id}>
                    <NumberInputField
                      {...register(`text_prompts.${index}.weight`)}
                    ></NumberInputField>
                  </NumberInput>
                  <Input flex="1" id={field.id} {...register(`text_prompts.${index}.prompt`)} />

                  <IconButton
                    onClick={handlePromptRemove(index)}
                    icon={<CloseIcon></CloseIcon>}
                  ></IconButton>
                </Flex>
              ))}
              <Button onClick={handlePromptAdd} leftIcon={<AddIcon></AddIcon>}>
                Add Prompt
              </Button>
            </VStack>

            <SimpleGrid marginTop="24px" minChildWidth="100px" gap="16px">
              <DynamicInput errors={errors} register={register} name={"batch_name"} />
              <DynamicInput errors={errors} register={register} name={"n_batches"} />
              <DynamicInput errors={errors} register={register} name={"steps"} />
              <DynamicInput errors={errors} register={register} name={"width"} />
              <DynamicInput errors={errors} register={register} name={"height"} />
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Heading flex="1" textAlign="left" as="h2" fontSize="lg">
                Initial Noise Settings
              </Heading>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <DynamicInput errors={errors} register={register} name={"perlin_init"} />
            <SimpleGrid marginTop="24px" minChildWidth="100px" gap="16px">
              <DynamicInput errors={errors} register={register} name={"init_generator"} />

              <DynamicInput errors={errors} register={register} name={"perlin_mode"} />
              <DynamicInput errors={errors} register={register} name={"voronoi_points"} />
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Heading flex="1" textAlign="left" as="h2" fontSize="lg">
                Model Settings
              </Heading>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SimpleGrid marginTop="16px" spacing="16px" minChildWidth="100px">
              <DynamicInput errors={errors} register={register} name={"RN50"} />

              <DynamicInput errors={errors} register={register} name={"RN101"} />
              <DynamicInput errors={errors} register={register} name={"RN50x64"} />
              <DynamicInput errors={errors} register={register} name={"RN50x16"} />
              <DynamicInput errors={errors} register={register} name={"RN50x4"} />
              <DynamicInput errors={errors} register={register} name={"ViTB16"} />
              <DynamicInput errors={errors} register={register} name={"ViTB32"} />
              <DynamicInput errors={errors} register={register} name={"ViTL14"} />
              <DynamicInput errors={errors} register={register} name={"ViTL14_336"} />
            </SimpleGrid>
            <SimpleGrid marginTop="16px" minChildWidth="100px" spacing="16px">
              <DynamicInput errors={errors} register={register} name={"use_secondary_model"} />
              <DynamicInput errors={errors} register={register} name={"randomize_class"} />
            </SimpleGrid>
            <DynamicInput errors={errors} register={register} name={"diffusion_model"} />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Heading flex="1" textAlign="left" as="h2" fontSize="lg">
                Cut Settings
              </Heading>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SimpleGrid marginTop="16px" spacing="16px" minChildWidth="250px">
              <DynamicInput errors={errors} register={register} name={"cutn_batches"} />
              <DynamicInput errors={errors} register={register} name={"clip_guidance_scale"} />
              <DynamicInput errors={errors} register={register} name={"cut_overview"} />
              <DynamicInput errors={errors} register={register} name={"cut_innercut"} />
              <DynamicInput errors={errors} register={register} name={"cut_icgray_p"} />
              <DynamicInput errors={errors} register={register} name={"cut_ic_pow"} />
              <DynamicInput errors={errors} register={register} name={"eta"} />
              <DynamicInput errors={errors} register={register} name={"clamp_max"} />
              <DynamicInput errors={errors} register={register} name={"rand_mag"} />
              <DynamicInput errors={errors} register={register} name={"tv_scale"} />
              <DynamicInput errors={errors} register={register} name={"range_scale"} />
              <DynamicInput errors={errors} register={register} name={"sat_scale"} />
            </SimpleGrid>

            <SimpleGrid marginTop="16px" spacing="16px" minChildWidth="250px">
              <DynamicInput errors={errors} register={register} name={"clamp_grad"} />
              <DynamicInput errors={errors} register={register} name={"clip_denoised"} />
              <DynamicInput errors={errors} register={register} name={"skip_augs"} />
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Heading flex="1" textAlign="left" as="h2" fontSize="lg">
                Symmetry Settings
              </Heading>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SimpleGrid marginTop="16px" minChildWidth="100px" spacing="16px">
              <DynamicInput errors={errors} register={register} name={"symmetry_loss"} />
              <DynamicInput errors={errors} register={register} name={"v_symmetry_loss"} />
            </SimpleGrid>
            <SimpleGrid marginTop="16px" minChildWidth="100px" spacing="16px">
              <DynamicInput errors={errors} register={register} name={"symmetry_loss_scale"} />
              <DynamicInput errors={errors} register={register} name={"v_symmetry_loss_scale"} />
              <DynamicInput errors={errors} register={register} name={"symmetry_switch"} />
              <DynamicInput errors={errors} register={register} name={"v_symmetry_switch"} />
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Heading flex="1" textAlign="left" as="h2" fontSize="lg">
                Miscellaneous Settings
              </Heading>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SimpleGrid marginTop="16px" spacing="16px" minChildWidth="250px">
              <DynamicInput errors={errors} register={register} name={"twilio_account_sid"} />
              <DynamicInput errors={errors} register={register} name={"twilio_auth_token"} />
              <DynamicInput errors={errors} register={register} name={"twilio_from"} />
              <DynamicInput errors={errors} register={register} name={"twilio_to"} />
              <DynamicInput errors={errors} register={register} name={"cuda_device"} />
              <DynamicInput errors={errors} register={register} name={"init_image"} />
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <SimpleGrid marginTop="24px" minChildWidth="250px" spacing="16px">
        <Button onClick={submit} isDisabled>
          Submit Job (Coming Soon)
        </Button>
        <Button onClick={openImportModal}>Import Settings from YAML</Button>
        <Button onClick={exportYaml}>Export Settings to YAML</Button>
      </SimpleGrid>

      <Modal type="lg" scrollBehavior="inside" isOpen={exportOpen} onClose={closeExportModal}>
        <ModalOverlay />
        <ModalContent height="90vh" minWidth={["350px", "600px", "900px"]}>
          <ModalHeader>Exported Yaml</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea height="100%" size="lg" isReadOnly value={exportedYaml}></Textarea>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeExportModal}>
              Close
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(exportedYaml)
              }}
              colorScheme="blue"
            >
              Copy To Clipboard
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal type="lg" scrollBehavior="inside" isOpen={importOpen} onClose={closeImportModal}>
        <ModalOverlay />
        <ModalContent height="90vh" minWidth={["350px", "600px", "900px"]}>
          <ModalHeader>Paste Yaml to Import</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={yamlToImport}
              onChange={(e) => setYamlToImport(e?.target?.value)}
              height="100%"
            ></Textarea>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeImportModal}>
              Close
            </Button>
            <Button onClick={importYaml} colorScheme="blue">
              Import
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default JobGenerator
