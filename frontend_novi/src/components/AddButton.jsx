import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import AddDeviceDialog from "./AddDeviceDialog";
import axiosInstance from "../api/axios";

export default function AddButton({ onDeviceCreated }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDevice = async ({ location, deviceType }) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/devices", {
        device_type: deviceType,
        location_name: location,
      });
      if (onDeviceCreated) {
        onDeviceCreated(response.data);
      }
    } catch (error) {
      console.error("Error creating device:", error);
      throw new Error(
        error.response?.data?.detail || "Failed to create device"
      );
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
      >
        <FaPlus />
      </IconButton>

      <AddDeviceDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateDevice}
        isLoading={isLoading}
      />
    </>
  );
}
