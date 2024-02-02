/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import type { AppProps } from 'next/app';
import { ChakraProvider,Portal,  Accordion,
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
extendTheme} from '@chakra-ui/react';
import theme from '@/theme/theme';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import AssistantOptions from '@/components/sidebar/components/AssistantOptions';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import { mode } from "@chakra-ui/theme-tools";


const themeInitial = extendTheme({
  ...theme,
  config: {
    initialColorMode: "dark",
  }
 
});

function App({ Component, pageProps }: AppProps<{}>) {
  const pathname = usePathname();
  const [apiKey, setApiKey] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonBg = useColorModeValue(
    'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
    'linear-gradient(15.46deg, #E1E7FD 26.3%, #D2D6DC 86.4%) !important'
  );

  //const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const initialKey = process.env.NEXT_PUBLIC_API_KEY;
    if (initialKey?.includes('sk-') && apiKey !== initialKey) {
      setApiKey(initialKey);
    }
    
  }, [apiKey]);


  const loadPrompt = (promptString: string) => {
    console.log("prompt==>>> ", promptString);
    //setPrompt(promptString);
  }

  
  

  const dataBlocks = [
    {
      title: 'Assitência Jurídica',
      buttons: [
        {
          text: 'Revise este documento pra mim.',
          onClick: (prompt: any) => { 
            setPrompt(prompt);
           },
          prompt: 'Diga como pode ajudar na revisão de um documento.',
        },
        {
          text: 'Me forneça um modelo de contrato',
          onClick: (prompt: any) => { 
            setPrompt(prompt);
           },
          prompt: 'Forneça um modelo básico de um contrato de trabalho.',
        },
        {
          text: 'Analise esta tese jurídica',
          onClick: (prompt: any) => { 
            setPrompt(prompt);
           },
          prompt: 'Diga como pode ajudar em uma análise de uma tese jurídica.',
        },
      ],
    },
    {
      title: 'Criar',
      buttons: [
        {
          text: 'Um poema com três estrofes sobre...',
          onClick: (prompt: any) => { 
            setPrompt(prompt);
           },
          prompt: 'Crie um poema com três estrofes sobre o sentido da liberdade.',
        },
        {
          text: 'Análise literária de um texto',
          onClick: (prompt: any) => { 
            setPrompt(prompt);
           },
          prompt: 'Diga como pode ajudar em uma análise literária de um texto.',
        },
        {
          text: 'Sumarize este texto',
          onClick: (prompt: any) => { 
            setPrompt(prompt);
           },
          prompt: 'Diga como pode ajudar a sumarizar um texto.',
        },
      ],
    },
    {
      title: 'Explorar',
      buttons: [
        {
          text: 'As melhores praias do Brasil',
          onClick: (prompt: any) => { 
            setPrompt(prompt);
           },
          prompt: 'Diga como pode ajudar sobre dicas de melhores praias no Brasil.',
        },
        {
          text: 'Roteiro de 5 dias para o Jalapão',
          onClick: (prompt: any) => { 
            setPrompt(prompt);
           },
          prompt: 'Monte um roteiro de 5 dias de uma viagem ao Jalapão no Tocantins.',
        },
        {
          text: 'Liste os melhores filmes de Christopher Nolan',
          onClick: (prompt: any) => { 
            setPrompt(prompt);
           },
          prompt: 'Liste os principais filmes de Christopher Nolan.',
        },
      ],
    }
  ];

  return (
    <ChakraProvider theme={themeInitial}>
      <Box>
         <Sidebar setApiKey={setApiKey} routes={routes} />  
        <Box
          pt={{ base: '60px', md: '100px' }}
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Portal>

            <Box>
               <Navbar
                setApiKey={setApiKey}
                onOpen={onOpen}
                logoText={'Horizon UI Dashboard PRO'}
                brandText={getActiveRoute(routes, pathname)}
                secondary={getActiveNavbar(routes, pathname)}
              /> 


            </Box>
          </Portal>
          <Box
            mx="auto"
            p={{ base: '20px', md: '30px' }}
            pe="20px"
            minH="100vh"
            pt="50px"
          >
            
            <Flex direction="column" mb="8">
              <Text
                as="span"
                fontWeight="bold"
                fontSize="2xl"
                color="gray.500"
                mr="2"
              >
                Olá, sou o Tars.
              </Text>
              <Text
                as="span"
                fontWeight="bold"
                fontSize="2md"
                color="gray.500"
                mr="2"
                pl={{ base: '0', }}
              >
                Diga o que está pensando ou escolha uma sugestão.
              </Text>
            </Flex>
              
            
            <AssistantOptions data={dataBlocks} isMobile={isMobile} loadPrompt={loadPrompt} setPrompt={setPrompt} />
            <Component apiKeyApp={apiKey} {...pageProps} isMobile={isMobile} prompt={prompt} setPrompt={setPrompt} />
          </Box> 
          <Box>
            <Footer />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
