import { CopyIcon } from '@chakra-ui/icons';
import { Button, useToast } from '@chakra-ui/react';

export function CopyButton(props) {
  const toast = useToast();

  function handleCopy() {
    navigator.clipboard.writeText(props.value);

    toast({
      title: 'Value copied to clipboard',
      description: props.value,
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  }

  return (
    <Button size="sm" onClick={handleCopy}>
      <CopyIcon />
    </Button>
  );
}
