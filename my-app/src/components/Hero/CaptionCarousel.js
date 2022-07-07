import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  useBreakpointValue,
  Stack,
  Text,
  Container,
} from '@chakra-ui/react';
import { Link } from "react-router-dom"

import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import Slider from 'react-slick';

// Settings for the slider
const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export function CaptionCarousel({amount}) {
  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = useState(null);
  const [data, setData] = useState(null);
  // TODO: Complete or delete
  const [loading, setLoading] = useState(true);
  // TODO: Complete or delete
  const [error, setError] = useState(null);
  // These are the breakpoints which changes the position of the
  // buttons as the screen size changes
  const top = useBreakpointValue({ base: '90%', md: '50%' });
  const side = useBreakpointValue({ base: '30%', md: '40px' });
  function fetchFeed(amount) {
    let url = `https://api.feverdreams.app/random/${amount}/pano`
    console.log(url)
    fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((actualData) => {
      setData(actualData);
      setError(null);
    })
    .catch((err) => {
      setError(err.message);
      setData(null);
    })
    .finally(() => {
      setLoading(false);
    });
  }
  useEffect(() => {
    fetchFeed(amount)
  },[amount]);

  return (
    <Box
      position={'relative'}
      height={'512px'}
      width={'100%'}
      maxW={'2048px'}
      overflow={'hidden'}>
      {/* CSS files for react-slick */}
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      {/* Left Icon */}
      <IconButton
        aria-label="left-arrow"
        variant="ghost"
        position="absolute"
        left={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickPrev()}>
        <BiLeftArrowAlt size="40px" />
      </IconButton>
      {/* Right Icon */}
      <IconButton
        aria-label="right-arrow"
        variant="ghost"
        position="absolute"
        right={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickNext()}>
        <BiRightArrowAlt size="40px" />
      </IconButton>
      {/* Slider */}
      <Slider {...settings} ref={(slider) => setSlider(slider)}>  
        {data && data.map((img, index) => (
          <Link to={`/piece/${img.uuid}`} key={index}>
            <Box
              // height={'6xl'}
              position="relative"
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
              backgroundSize="cover"
              maxW={2048}
              backgroundImage={`https://images.feverdreams.app/thumbnail/${img.uuid}/2048`}>
              {/* This is the block you need to change, to customize the caption */}
              <Container maxW={2048} height={512} position="relative">
                <Box position="absolute" bottom="0" left="0" right="0" p={3} >
                  <Box style={{"backgroundColor":"rgb(0,0,0,0.5)"}} p={5} borderRadius="md" borderWidth={1}>
                    <Text w={'100%'} fontSize={{ base: 'md', lg: 'lg' }} color="white">
                      {img.text_prompt}
                    </Text>
                  </Box>
                </Box>
              </Container>
            </Box>
          </Link>
        ))}
      </Slider>
    </Box>
  );
}