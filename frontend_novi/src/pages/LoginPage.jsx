import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Heading, Input, Button, Text, Link } from "@chakra-ui/react";
import axiosInstance from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "/users/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = response.data;

      console.log("Response data:", data);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name,
          lastName: data.last_name,
          email: data.email,
          role: data.role,
        })
      );

      setError(null);
      navigate("/main/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Login failed");
    }
  };

  return (
    <Flex
      h="100vh"
      alignItems="center"
      justifyContent="center"
      bgGradient="to-r"
      gradientFrom="#E5D0AC"
      gradientTo="#A31D1D"
    >
      <Flex
        as="form"
        onSubmit={handleLogin}
        flexDirection="column"
        p={12}
        borderRadius={8}
        boxShadow="lg"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <Heading mb={6} color="#6D2323">
          Log In
        </Heading>
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}

        <Input
          placeholder="johndoe@gmail.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="filled"
          mb={3}
          required
          bg="whiteAlpha.800"
          color="black"
        />
        <Input
          placeholder="**********"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="filled"
          mb={6}
          required
          bg="whiteAlpha.800"
          color="black"
        />
        <Button type="submit" colorPalette="orange" variant="subtle" mb={8}>
          Log In
        </Button>

        <Text textAlign="center" color="#6D2323">
          Don’t have an account?{" "}
          <Link color="#FEF9E1" href="/register">
            Register
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
}

export default Login;
