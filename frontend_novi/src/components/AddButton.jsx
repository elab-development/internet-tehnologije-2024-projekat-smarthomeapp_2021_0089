import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import AddDeviceDialog from "./AddDeviceDialog";


export default function AddButton({ onDeviceCreated }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDevice = async ({ location, deviceType }) => {
    setIsLoading(true);

    try {
      const authToken = localStorage.getItem('access_token');
      if (!authToken) {
        throw new Error("Authentication token missing");
      }

      const response = await fetch("http://localhost:8000/devices", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          device_type: deviceType,
          location_name: location
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Failed to create device");
      }
      if (onDeviceCreated) {
        onDeviceCreated(result);
      }

    } catch (error) {
      console.error('Error creating device:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IconButton
        variant="solid"
        bg="#A31D1D"
        _hover={{ bg: "#881818" }}
        _active={{ bg: "#700F0F" }}
        size="s"
        rounded="full"
        height={10}
        width={10}
        onClick={() => setIsDialogOpen(true)}
        aria-label="Add device"
      ><FaPlus /></IconButton>

      <AddDeviceDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateDevice}
        isLoading={isLoading}
      />
    </>
  );
}