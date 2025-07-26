import { useState } from "react";
import {
  Dialog,
  Portal,
  Input,
  VStack,
  Text,
  Alert,
  Button,
} from "@chakra-ui/react";
import axios from "axios";

const ChangePasswordDialog = ({ isOpen, onClose, userEmail }) => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetAndClose = () => {
    setNewPassword("");
    setError("");
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!newPassword.trim()) {
      setError("Password cannot be empty");
      return;
    }

    try {
      await axios.post("http://localhost:8000/users/reset-password", {
        //ne koristi se axiosInstance jer nije potrebna autentikacija za ovu rutu
        email: userEmail,
        new_password: newPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        resetAndClose();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to change password"
      );
    }
  };

  return (
    <Dialog.Root open={isOpen} onClose={resetAndClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Change Password</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {success ? (
                <Alert.Root status="success" variant="subtle">
                  <Alert.Indicator />
                  <Alert.Title>Password changed successfully</Alert.Title>
                </Alert.Root>
              ) : (
                <VStack spacing={4} mb={4}>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    focusBorderColor="#A31D1D"
                    borderColor="gray.300"
                  />
                  {error && <Text color="red.500">{error}</Text>}
                </VStack>
              )}
            </Dialog.Body>
            {!success && (
              <Dialog.Footer>
                <Button variant="outline" mr={3} onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleSubmit}>
                  Change
                </Button>
              </Dialog.Footer>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ChangePasswordDialog;
