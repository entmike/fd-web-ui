import { inputConfig } from "components/shared/DicoParameters"
import { compose, pick } from "ramda"
import { parse, stringify } from "yaml"

const parseTextPrompts = (rawParsedYaml) => {
  let promptState = []

  Object.entries(rawParsedYaml).forEach(([startFrame, prompts]) => {
    prompts?.forEach((prompt) => {
      const [text, weight = 1] = prompt?.split(":")
      promptState.push({
        startFrame,
        prompt: text,
        weight,
      })
    })
  })

  return promptState
}
const stringifyTextPrompts = (inputState) => {
  let formatted = {}

  inputState.forEach(({ startFrame, prompt, weight }) => {
    const promptWithWeight = `${prompt}:${weight}`
    if (formatted[startFrame]) {
      formatted[startFrame].push(promptWithWeight)
    } else {
      formatted[startFrame] = [promptWithWeight]
    }
  })

  return formatted
}
const stringifyDimensions = (height, width) => [width, height]
const parseDimensions = (dimensions) => {
  if (!dimensions) return { width: 1280, height: 768 }
  return {
    width: dimensions[0],
    height: dimensions[1],
  }
}

const parseCudaDevice = (string) => {
  const [, index] = string?.split(":")

  return index?.trim()
}

const stringifyCudaDevice = (index) => `cuda:${index}`

export const stateToYaml = (state) => {
  // TODO: add more special parsers to make UX better

  const rawYaml = compose(
    stringify,
    pick(Object.keys(inputConfig)),
    (state) => {
      return {
        ...state,
        text_prompts: stringifyTextPrompts(state.text_prompts),
        width_height: stringifyDimensions(state.height, state.width),
        cuda_device: stringifyCudaDevice(state?.cuda_device),
      }
    },
    (state) => {
      let mappedState = {}
      Object.entries(state).forEach(([key, value]) => {
        const fieldType = inputConfig?.[key]?.type
        if (fieldType === "integer") {
          mappedState[key] = parseInt(value)
        } else if (fieldType === "float") {
          mappedState[key] = parseFloat(value)
        } else if (fieldType === "string") {
          mappedState[key] = value || null
        } else {
          mappedState[key] = value
        }
      })
      return mappedState
    }
  )(state)

  return rawYaml
}

// TODO: add more validations here
export const yamlToState = (yaml) => {
  const parsedState = compose(
    pick(Object.keys(inputConfig)),
    (parsed) => {
      const { height, width } = parseDimensions(parsed?.width_height)

      return {
        ...parsed,
        text_prompts: parseTextPrompts(parsed?.text_prompts),
        cuda_device: parseCudaDevice(parsed?.cuda_device),
        width,
        height,
      }
    },
    parse
  )(yaml)

  return parsedState
}
