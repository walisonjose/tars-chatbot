import ReactMarkdown from 'react-markdown'
import { Icon, useColorModeValue } from '@chakra-ui/react'
import Card from '@/components/card/Card'
import { FaCopy } from 'react-icons/fa';

export default function MessageBox(props: { output: string, copyToClipboard: any}) {
  const { output } = props
  const textColor = useColorModeValue('navy.700', 'white')
  return (
    <Card
      id='message-box'
      mb="60px" // Adiciona um espaçamento de 20px na parte inferior
      display={output ? 'flex' : 'none'}
      px="22px !important"
      pl="22px !important"
      color={textColor}
      minH="50px"
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight={{ base: '24px', md: '26px' }}
      fontWeight="500"
    >
      <ReactMarkdown className="font-medium" >
        {output ? output : ''}
      </ReactMarkdown>
      
      <Icon
        as={FaCopy}
        ml="auto"
        w="20px"
        h="20px"
        color="gray.500"
        _hover={{ color: 'gray.600' }}
        cursor="pointer" 
        onClick={() => {
          props.copyToClipboard(output);
        }}
        title="Clique para copiar"
      />
        
      
    </Card>
  )
}
