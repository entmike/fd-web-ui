import React from 'react';
import {Button,useColorModeValue} from '@chakra-ui/react';

export function SocialButton ({ children, label, href }) {
    return <Button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      // w={24}
      // h={12}
      cursor={'pointer'}
      as={'a'}
      href={href}
      target={'_blank'}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'left'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      {children}&nbsp;{label}
    </Button>
};