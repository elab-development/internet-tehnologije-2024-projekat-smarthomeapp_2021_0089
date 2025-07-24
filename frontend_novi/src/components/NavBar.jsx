import {
  Flex,
  Image,
  Box,
  Text,
  Button,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import logo from "../assets/image.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

export default function NavBar() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const email = storedUser?.email || "";
  const initial = storedUser?.name?.charAt(0).toUpperCase() || "?";

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout");

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  // const handleLogout = async () => {
  //   const token = localStorage.getItem("access_token");

  //   try {
  //     await fetch("http://localhost:8000/users/logout", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     // ocisti localStorage
  //     localStorage.removeItem("access_token");
  //     localStorage.removeItem("user");

  //     // navigacija na login
  //     navigate("/login");
  //   } catch (err) {
  //     console.error("Logout failed", err);
  //   }
  // };

  return (
    <Flex as="nav" p={5} alignItems="center" wrap={"wrap"} rowGap={"5"}>
      <Image src={logo} width={{ base: "200px", md: "270px" }} />
      <Spacer />

      <HStack spacing="20px">
        <Box bg="gray.200" p="10px 15px" borderRadius="50%">
          {initial}
        </Box>
        <Text>{email}</Text>
        <Button bgColor="#A31D1D" onClick={handleLogout}>
          Logout
        </Button>
      </HStack>
    </Flex>
  );
}
