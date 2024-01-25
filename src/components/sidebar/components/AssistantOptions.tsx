'use client';
// Chakra imports
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Button,
    Flex,
    Icon,
    Input,
    Link,
    ListItem,
    UnorderedList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    useMediaQuery,
  } from '@chakra-ui/react';

import { HorizonLogo } from '@/components/icons/Icons';
import { HSeparator } from '@/components/separator/Separator';

export function AssistantOptions(props: { data: any, isMobile: boolean, loadPrompt: any, setPrompt: any}) {
    //   Chakra color mode
    let logoColor = useColorModeValue('navy.700', 'white');
    const gray = useColorModeValue('gray.500', 'white');

    const buttonBg = useColorModeValue(
        'linear-gradient(15.46deg, #E1E7FD 26.3%, #D2D6DC 86.4%) !important',
        'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important'

    );
    //const [isMobile] = useMediaQuery('(max-width: 768px)');
    const { data, isMobile } = props;

    return (
        <Flex overflowX={isMobile ? 'scroll' : 'hidden'}>
            {data?.map((block: any, index: number) => (
                <Box
                    key={index}
                    bg={buttonBg}
                    borderRadius="16px"
                    boxShadow="md"
                    p="4"
                    mb="4"
                    ml="6"
                    textAlign="center" // Add textAlign="center" to center the box
                >
                    <Box textAlign="left" mb="4">
                        <Text fontWeight="bold">{block.title}</Text>
                    </Box>
                    {block.buttons?.map((button: any, buttonIndex: number) => (
                        <Button
                            key={buttonIndex}
                            onClick={() => { 
                                button.onClick(button.prompt);
                             }}
                            display="flex"
                            variant="api"
                            fontSize="sm"
                            fontWeight="600"
                            borderRadius="45px"
                            mt="8px"
                            minH="40px"
                            ml="0" // Add ml="0" to align the button to the left
                        >
                            {button.text}
                        </Button>
                    ))}
                </Box>
            ))}
        </Flex>
    );
}

export default AssistantOptions;
