import { Flex, Image, Box, Text, Button, Spacer, HStack } from "@chakra-ui/react"
import logo from '../assets/image.png';

export default function NavBar() {
  return (
    <Flex as="nav" p={5} alignItems="center">
      <Image src={logo} width={{ base: "100px", md: "270px" }}/>
      <Spacer />

      <HStack spacing="20px"> 
        <Box bg="gray.200" p="10px 15px" borderRadius="50%">T</Box>
        <Text>tamtam@example.com</Text>
        <Button bgColor="#A31D1D">Logout</Button>
      </HStack>
    </Flex>
  )
}