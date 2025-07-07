import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  Text,
  Link
} from "@chakra-ui/react";

function Register() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          lastname,
          mail: email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err.message);
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
        onSubmit={handleRegister}
        flexDirection="column"
        p={12}
        borderRadius={8}
        boxShadow="lg"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
        w={{ base: '90%', md: '400px' }}
      >
        <Heading mb={6} color="#6D2323">
          Register
        </Heading>
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}
        {success && (
          <Text textAlign="center" color="red.500" mb={4}>
            {success}{' '}
            <Link color="#FEF9E1" href="/login">
              Go to Login
            </Link>
          </Text>
        )}
        <Input
          placeholder="First Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="filled"
          mb={3}
          required
          bg="whiteAlpha.800"
          color="black"
          _placeholder={{ color: 'gray.500' }}
        />
        <Input
          placeholder="Last Name"
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          variant="filled"
          mb={3}
          required
          bg="whiteAlpha.800"
          color="black"
          _placeholder={{ color: 'gray.500' }}
        />
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
          _placeholder={{ color: 'gray.500' }}
        />
        <Input
          placeholder="* Password *"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="filled"
          mb={6}
          required
          bg="whiteAlpha.800"
          color="black"
          _placeholder={{ color: 'gray.500' }}
        />
        <Button type="submit" colorPalette="orange" variant="subtle" mb={8}>
          Register
        </Button>
        <Text textAlign="center" color="#6D2323">
          Already have an account?{' '}
          <Link color="#FEF9E1" href="/login">
            Login here
          </Link>
        </Text>
      </Flex>
    </Flex>
  );

}

export default Register;
