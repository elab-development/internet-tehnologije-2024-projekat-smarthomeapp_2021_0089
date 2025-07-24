import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Flex, Button, Text, Card, HStack } from "@chakra-ui/react";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import axiosInstance from "../api/axios";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/users/me");
        const data = response.data;
        setUser(data);

        const locationsResponse = await axiosInstance.get(
          `/users/${data.user_id}/locations`
        );

        setLocations(locationsResponse.data);
      } catch (err) {
        const message = err.response?.data?.detail || err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token = localStorage.getItem("access_token");
  //     if (!token) {
  //       setError("No access token found");
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await fetch("http://localhost:8000/users/me", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         const errData = await response.json();
  //         throw new Error(errData.detail || "Failed to fetch user data");
  //       }

  //       const data = await response.json();
  //       setUser(data);

  //       const locationsResponse = await fetch(
  //         `http://localhost:8000/users/${data.user_id}/locations`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (!locationsResponse.ok) {
  //         const errData = await locationsResponse.json();
  //         throw new Error(errData.detail || "Failed to fetch locations");
  //       }

  //       const locationsData = await locationsResponse.json();
  //       setLocations(locationsData);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data</div>;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <Flex align="center" justify="center" bg="gray.50" px={4} py={12}>
      <Card.Root height="230px" width="280px">
        <Card.Header bg="#A31D1D" rounded={10} p={4}>
          <Flex justify="center" align="center" height="100%">
            <Text color="white" fontSize="xl" fontWeight="bold">
              USER INFO
            </Text>
          </Flex>
        </Card.Header>
        <Card.Body bg="white" rounded={10} p={4}>
          <Text>
            <strong>Name: </strong>
            {user.name}
          </Text>
          <Text>
            <strong>Last name: </strong>
            {user.lastname}
          </Text>
          <Text>
            <strong>Email: </strong>
            {user.mail}
          </Text>
          <Text mt={4} fontWeight="bold">
            Assigned Rooms:
          </Text>
          {locations.length > 0 ? (
            locations.map((loc) => (
              <Text key={loc.location_id}>• {loc.name}</Text>
            ))
          ) : (
            <Text>No rooms assigned</Text>
          )}

          <HStack
            spacing="40px"
            mx="auto"
            px="40px"
            width="100%"
            justify="center"
            marginTop="15px"
          >
            <Button bgColor="#A31D1D" onClick={handleLogout}>
              Logout
            </Button>

            <Button
              bgColor="#A31D1D"
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              Change password
            </Button>
          </HStack>
        </Card.Body>
      </Card.Root>
      <ChangePasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        userEmail={user.mail}
      />
    </Flex>
  );
}

export default Profile;
