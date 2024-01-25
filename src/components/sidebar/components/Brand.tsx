'use client';
// Chakra imports
import { Flex, useColorModeValue, Text } from '@chakra-ui/react';

import { HorizonLogo } from '@/components/icons/Icons';
import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
        {/*<HorizonLogo h="26px" w="146px" my="30px" color={logoColor} /> 
       <Text color={gray} fontSize="xs" fontWeight="bold" me="30px">
        Ações
  </Text>*/}
      <HSeparator mb="20px" w="284px" /> 
    </Flex>
  );
}

export default SidebarBrand;
