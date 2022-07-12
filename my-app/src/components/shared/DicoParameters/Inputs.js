import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
} from '@chakra-ui/react';

import { inputConfig } from '.';

export const DynamicInput = ({ errors, register, name }) => {
  const { type } = inputConfig[name];

  return type && type === 'string' ? (
    <TextInput errors={errors} register={register} name={name} />
  ) : type === 'integer' ? (
    <DiscoNumberInput errors={errors} register={register} name={name} />
  ) : type === 'float' ? (
    <DiscoNumberInput errors={errors} register={register} name={name} />
  ) : type === 'json' ? (
    <TextAreaInput errors={errors} register={register} name={name} />
  ) : type === 'select' ? (
    <SelectInput errors={errors} register={register} name={name} />
  ) : type === 'boolean' ? (
    <CheckboxInput errors={errors} register={register} name={name} />
  ) : null;
};

export const SelectInput = ({ errors, register, name }) => {
  const config = inputConfig[name];
  return (
    config && (
      <FormControl marginTop="16px" isInvalid={errors[name]}>
        <FormLabel htmlFor={name}>{config.label}</FormLabel>
        <Select {...register(name)}>
          {config.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
      </FormControl>
    )
  );
};

export const TextInput = ({ errors, register, name }) => {
  const config = inputConfig[name];
  return (
    config && (
      <FormControl marginTop="16px" isInvalid={errors?.[name]}>
        <FormLabel htmlFor={name}>{config.label}</FormLabel>
        <Input id={name} placeholder={config?.label} {...register(name)} />
        <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
      </FormControl>
    )
  );
};

export const DiscoNumberInput = ({ errors, register, name }) => {
  const config = inputConfig[name];
  return (
    config && (
      <FormControl marginTop="16px" isInvalid={errors[name]}>
        <FormLabel htmlFor={name}>{config.label}</FormLabel>
        <NumberInput id={name} placeholder={config?.label}>
          <NumberInputField {...register(name)}></NumberInputField>
        </NumberInput>
        <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
      </FormControl>
    )
  );
};

export const CheckboxInput = ({ register, name }) => {
  const config = inputConfig[name];
  return (
    <Checkbox id={name} {...register(name)}>
      {config.label || name}
    </Checkbox>
  );
};

export const TextAreaInput = ({ errors, register, name }) => {
  const config = inputConfig[name];
  return (
    config && (
      <FormControl marginTop="16px" isInvalid={errors[name]}>
        <FormLabel htmlFor={name}>{config.label}</FormLabel>
        <Textarea id={name} placeholder={config?.label} {...register(name)} />

        <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
      </FormControl>
    )
  );
};
