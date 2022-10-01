import { useState, useEffect } from 'react';
import { Box, Image, Link, IconButton, Show, Hide } from '@chakra-ui/react';
import { BsChevronUp } from 'react-icons/bs';
export function BackToTop(props) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return(
        <>
        {scrollPosition > 500 && (
        <Show above='sm'>
            <Link href='#'>
                <Box position='fixed'
                    bottom={'20px'}
                    right={'20px'}
                    zIndex={1}
                >
                    <IconButton isRound={"full"} size={"lg"} icon={<BsChevronUp color='white' />} colorScheme={"green"} variant={"solid"} style={{
                        backdropFilter : "blur(10px)",
                        backgroundColor : "rgba(0,60,220,0.4)"}
                    }/>
                </Box>
            </Link>
        </Show>
        )}
        </>
    )
}