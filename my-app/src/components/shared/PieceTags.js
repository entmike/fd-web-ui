import {
    Tag,
    Wrap,
    WrapItem,
  } from '@chakra-ui/react';
export const PieceTags = (props) => {
    return (
      <Wrap spacing={2} marginTop={props.marginTop}>
        {props.tags.map((tag) => {
          return (
            <WrapItem key={tag}>
              <Tag size={'md'} variant="solid">
                {tag}
              </Tag>
            </WrapItem>
          );
        })}
      </Wrap>
    );
  };