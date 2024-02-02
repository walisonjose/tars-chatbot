'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel } from '@/types/types';
import { createPrompt } from '@/utils/chatStream';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Img,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson } from 'react-icons/md';
import Bg from '../public/img/chat/bg-image.png';
import { FaCopy } from 'react-icons/fa';
import { FaRegCircleStop } from "react-icons/fa6";
import { AiFillAudio } from "react-icons/ai";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { run } from 'node:test';

export default function Chat(props: { apiKeyApp: string, isMobile: boolean, prompt: any, setPrompt: any}) {
  // *** If you use .env.local variable for your API key, method which we recommend, use the apiKey variable commented below
  const { apiKeyApp, isMobile, prompt } = props;
  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  // Response message
  const [outputCode, setOutputCode] = useState<string>('');
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  const [isSoundRecording, setIsSoundRecording] = useState<boolean>(false);
  const [recognition_obj, setRecognition] = useState(null);
  const [transcription_data, setTranscription] = useState(null);


  const [promptMessages, setPromptMessages] = useState<any>([]);


  

 

  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

// const genAI = new GoogleGenerativeAI('AIzaSyAlooAo0myCCzy2_e6d94t8wz21nDtQ8NE');
// const modelGoogle = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function runChat(promptMessagesData:any) {
  const genAI = new GoogleGenerativeAI('AIzaSyAlooAo0myCCzy2_e6d94t8wz21nDtQ8NE');
  const modelGoogle = genAI.getGenerativeModel({ model: 'gemini-pro' });

  
  //return;

  const generationConfig = {
    temperature: 0,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  

  let data = [];
  promptMessagesData.map((prompt: { role: any; content: any; })=>{
    let dataPrompt = {
      role: prompt.role,
      parts: [{ text: "" }],
    }
   dataPrompt = {
      ...dataPrompt,
      parts: [{ text: prompt.content }],
   }

    data.push(dataPrompt);
  })

data.push({ role: 'model',  parts: [{ text: "" }] });


  const chat = modelGoogle.startChat({
    generationConfig,
    safetySettings,
    history: data,
  });


  try{
    const result = await chat.sendMessage(inputCode);
    const response = result.response;
    return response.text() ;
  }catch(error){
    console.log("error", error);
    alert("Ops, algo deu errado! tente novamente.");
   // return "Ops, algo deu errado! tente novamente.";
  }
  
 
  
}


const createDataArray = (roleParam: string, text: string) => {
  const role = roleParam;
  const data = [
    {
      role: role,
      parts: [{ text: text }],
    },
  ];
  return data;
};

 

 const startSpeechRecognition = async () => {
  try {
    setIsSoundRecording(!isSoundRecording);

    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Verifique e defina a API de SpeechRecognition

    

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();

    console.log("recognition ", recognition);
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR'; // Set desired language
    //recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
        console.log(transcript);

      setTranscription(transcript);
      setInputCode(transcript);
      //handleTranslate();
    };

    recognition.onerror = (error) => {
      console.error('Speech recognition error:', error);
    };

    // Start recognition
    recognition.start();
    setRecognition(recognition);


  } catch (error) {
    console.error('Error accessing microphone:', error);
    alert('Error accessing microphone:', error);
  }
};

const stopSpeechRecognition = () => {
  if (recognition_obj) {
    console.log("stopSpeechRecognition", recognition_obj);
    recognition_obj.abort();
    //setRecognition(null);
  }
};


  

  // const startSpeechRecognition = async () => {
  //   try {
  //     setIsSoundRecording(!isSoundRecording);
  //     // Request microphone access
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
  //     // Create a new SpeechRecognition instance
  //     const recognition = new SpeechRecognition();
  //     recognition.continuous = true;
  //     recognition.interimResults = true;
  //     recognition.lang = 'pt-BR'; // Set desired language
  
  //     recognition.onresult = (event) => {
  //       const transcript = Array.from(event.results)
  //         .map((result) => result[0].transcript)
  //         .join('');
  //         console.log(transcript);
  
  //       setTranscription(transcript);
  //     };
  
  //     recognition.onerror = (error) => {
  //       console.error('Speech recognition error:', error);
  //     };
  
  //     // Start recognition
  //     recognition.start();
  //     setRecognition(recognition);
  //   } catch (error) {
  //     console.error('Error accessing microphone:', error);
  //   }
  // };
  
  // const stopSpeechRecognition = () => {
  //   if (recognition) {
  //     recognition.stop();
  //     setRecognition(null);
  //   }
  // };
  

 


  
  const handleTranslate = async () => {
    const apiKey = apiKeyApp;
    const promptMessagesData = promptMessages;
   const messagePrompt = prompt ? prompt : inputCode
   // Adiciona o objeto JSON ao array
promptMessagesData.push({ role: 'user', content: messagePrompt });

    if(prompt){
      setInputCode(prompt);
      setInputOnSubmit(prompt);
    }else{
      setInputOnSubmit(inputCode);
    }

    // Chat post conditions(maximum number of characters, valid message etc.)
    const maxCodeLength = model === 'gpt-3.5-turbo' ? 700 : 700;

    // if (!apiKeyApp?.includes('sk-') && !apiKey?.includes('sk-')) {
    //   alert('Please enter an API key.');
    //   return;
    // }

    // if (!inputCode && prompt !== false) {
    //   alert('Please enter your message.');
    //   return;
    // }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }
    setOutputCode(' ');
    setLoading(true);
    
    const result = await runChat(promptMessagesData);
    setOutputCode(result);
    promptMessagesData.push({ role: 'model', content: "" });
    const messageoutPutCodeFormated = { role: 'model', content: result };
     promptMessagesData[promptMessagesData.length - 1] = messageoutPutCodeFormated;
     setPromptMessages(promptMessagesData);
   


    // const controller = new AbortController();
    // const body: ChatBody = {
    //   inputCode: promptMessagesData,
    //   // prompt ? prompt : inputCode,
    //   model,
    //   apiKey,
    // };

    // // -------------- Fetch --------------
    // const response = await fetch('/api/chatAPI', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   signal: controller.signal,
    //   body: JSON.stringify(body),
    // });

    // if (!response.ok) {
    //   setLoading(false);
    //   // if (response) {
    //   //   alert(
    //   //     'Something went wrong went fetching from the API. Make sure to use a valid API key.',
    //   //   );
    //   // }
    //   return;
    // }

    // const data = response.body;

    // if (!data) {
    //   setLoading(false);
    //   alert('Something went wrong');
    //   return;
    // }

    // const reader = data.getReader();
    // const decoder = new TextDecoder();
    // let done = false;
    // let outPutbackup = '';

    // promptMessagesData.push({ role: 'system', content: "" });

    // while (!done) {
    //   setLoading(true);
    //   scrollToBottom();
    //   const { value, done: doneReading } = await reader.read();
    //   done = doneReading;
    //   const chunkValue = decoder.decode(value);
    //   outPutbackup =  outPutbackup+chunkValue;
    //   setOutputCode((prevCode) => prevCode + chunkValue);
    //   const outPutCodeFormated = createPrompt(outPutbackup);
    // const messageoutPutCodeFormated = { role: 'system', content: outPutCodeFormated };
    //  promptMessagesData[promptMessagesData.length - 1] = messageoutPutCodeFormated;
    //  setPromptMessages(promptMessagesData);
    //   scrollToBottom();
    // }
    
    setInputCode('');
     setLoading(false);
    props.setPrompt(false);
  };
  // -------------- Copy Response --------------
  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  // *** Initializing apiKey with .env.local value
  // useEffect(() => {
  // ENV file verison
  // const apiKeyENV = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  // if (apiKey === undefined || null) {
  //   setApiKey(apiKeyENV)
  // }
  // }, [])

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight+300,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (prompt) {
     setInputCode(prompt);
     handleTranslate();
    }
    }, [prompt])

  

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
     
    >
       {/* <Img
        src={Bg.src}
        position={'absolute'}
        w="350px"
        left="50%"
        top="50%"
        transform={'translate(-50%, -50%)'}
      />  */}
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        {/* Model Change 
        <Flex direction={'column'} w="100%" mb={outputCode ? '20px' : 'auto'}>
          <Flex
            mx="auto"
            zIndex="2"
            w="max-content"
            mb="20px"
            borderRadius="60px"
          >
           {/* <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'gpt-3.5-turbo' ? buttonBg : 'transparent'}
              w="174px"
              h="70px"
              boxShadow={model === 'gpt-3.5-turbo' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('gpt-3.5-turbo')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdAutoAwesome}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              GPT-3.5
            </Flex>
             <Flex
              cursor={'pointer'}
              transition="0.3s"
              justify={'center'}
              align="center"
              bg={model === 'gpt-4' ? buttonBg : 'transparent'}
              w="164px"
              h="70px"
              boxShadow={model === 'gpt-4' ? buttonShadow : 'none'}
              borderRadius="14px"
              color={textColor}
              fontSize="18px"
              fontWeight={'700'}
              onClick={() => setModel('gpt-4')}
            >
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={bgIcon}
                me="10px"
                h="39px"
                w="39px"
              >
                <Icon
                  as={MdBolt}
                  width="20px"
                  height="20px"
                  color={iconColor}
                />
              </Flex>
              GPT-4
            </Flex>
          </Flex> */}

           {/* <Accordion color={gray} allowToggle w="100%" my="0px" mx="auto">
            <AccordionItem border="none">
              <AccordionButton
                borderBottom="0px solid"
                maxW="max-content"
                mx="auto"
                _hover={{ border: '0px solid', bg: 'none' }}
                _focus={{ border: '0px solid', bg: 'none' }}
              >
                <Box flex="1" textAlign="left">
                  <Text color={gray} fontWeight="500" fontSize="sm">
                    No plugins added
                  </Text>
                </Box>
                <AccordionIcon color={gray} />
              </AccordionButton>
              <AccordionPanel mx="auto" w="max-content" p="0px 0px 10px 0px">
                <Text
                  color={gray}
                  fontWeight="500"
                  fontSize="sm"
                  textAlign={'center'}
                >
                  This is a cool text example.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion> 
        </Flex>  */}
        {/* Main Box */}
    
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display="flex"
          //display={outputCode ? 'flex' : 'none'}
         mb="15px"
        >

         

      {    promptMessages.map((message: any, index: number) => {
          return  message.role === 'user' ?  (

        <>
          <Flex w="100%" align={'center'} mb="35px">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'transparent'}
              border="1px solid"
              borderColor={borderColor}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdPerson}
                width="20px"
                height="20px"
                color={brandColor}
              />
            </Flex>
            
            
            <Flex
              p="22px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              w="100%"
              zIndex={'2'}
            >
              <Text
                color={textColor}
                fontWeight="600"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight={{ base: '24px', md: '26px' }}
              >
                {message?.content}
              </Text>
              <Icon
                cursor="pointer"
                as={FaCopy}
                ms="auto"
                width="20px"
                height="20px"
                onClick={() => {
                  copyToClipboard(message?.content);
                }}
                color={gray}
              />
            </Flex>
          </Flex>
          </>
            ) : (
              <>
          <Flex w="100%">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdAutoAwesome}
                width="20px"
                height="20px"
                color="white"
              />
            </Flex>
            <MessageBoxChat output={message?.content} copyToClipboard={copyToClipboard}  />
          </Flex>
          </>
            )})}

        </Flex>
        {/* Chat Input */}
        <Flex
            ms={{ base: '0px', xl: '-130px' }}
            mt={ isMobile ?  "-35px" :  "20px"} 
            // justifySelf={'flex-end'}
           
        >
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Digite uma pergunta ou comando"
            value={inputCode}
            onChange={handleChange}
          />

            <Flex alignItems="center">
              <Icon
                as={ isSoundRecording ? FaRegCircleStop : AiFillAudio}
                onClick={async()=>{
                  if (isSoundRecording) {
                    stopSpeechRecognition(); // Chama a função para parar a gravação
                  } else {
                    await startSpeechRecognition(); // Inicia a gravação
                  }
                  setIsSoundRecording(!isSoundRecording); // Alterna o estado
                }}
                cursor={'pointer'}
                width="40px"
                height="40px"
                color="white"
                mx="10px" // Add horizontal spacing
              />
              <Button
                variant="primary"
                py="20px"
                px="16px"
                fontSize="sm"
                borderRadius="45px"
                ms="auto"
                w={{ base: '160px', md: '180px' }}
                h="54px"
                _hover={{
                  boxShadow:
                    '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
                  bg:
                    'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
                  _disabled: {
                    bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
                  },
                }}
                onClick={handleTranslate}
                isLoading={loading ? true : false}
              >
                Enviar
              </Button>
            </Flex>
            {/* Enviar
          </Button> */}
        </Flex>

         <Flex
          justify="center"
          mt="20px"
          direction={{ base: 'column', md: 'column' }}
          alignItems="center"
          textAlign={{ base: 'center', md: 'left' }}
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
          O Tars é um chatbot que se pluga a uma IA generativa para interagir com o usuário, dada a natureza complexa dessa interação pode fornecer informações imprecisas.
            </Text>
           <Link href="https://deepmind.google/technologies/gemini/#introduction">
            <Text
              fontSize="xs"
              color={textColor}
              fontWeight="500"
              textDecoration="underline"
            >
              Powered by Gemini Pro
            </Text>
          </Link> 
        </Flex> 
      </Flex>
    </Flex>
  );
}
function setTranscription(transcript: string) {
  throw new Error('Function not implemented.');
}

