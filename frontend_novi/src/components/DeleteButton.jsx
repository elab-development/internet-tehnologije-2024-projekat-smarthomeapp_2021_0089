import { useState, useEffect } from "react";
import {
    IconButton,
    Button,
    Text,
    Alert,
    Dialog,
    Portal,
    VStack
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

export default function DeleteButton({ deviceId, onDeleted }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const authToken = localStorage.getItem("access_token");
            if (!authToken) {
                throw new Error("Authentication token missing");
            }

            const response = await fetch(`http://localhost:8000/devices/${deviceId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.detail || "Failed to delete device");
            }

            setSuccess(true);
            setTimeout(() => {
                if (onDeleted) onDeleted();
            }, 2000); // sačekaj 2 sekunde


        } catch (err) {
            console.error("Delete failed:", err);
            setError(err.message || "Unexpected error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(false);
                setError(null);
                setIsDialogOpen(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    return (
        <>
            <IconButton
                variant="solid"
                bg="red.600"
                _hover={{ bg: "red.700" }}
                _active={{ bg: "red.800" }}
                size="s"
                height={10}
                width={10}
                onClick={() => setIsDialogOpen(true)}
                aria-label="Delete device"
            ><FaTrash /></IconButton>

            <Dialog.Root open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Confirm Deletion</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <VStack spacing={4}>
                                    {!success && !error && (
                                        <Text>Are you sure you want to delete this device?</Text>
                                    )}

                                    {success && (
                                        <Alert.Root status="success" variant="solid" width="100%">
                                            <Alert.Indicator />
                                            <Alert.Title>Device deleted successfully</Alert.Title>
                                        </Alert.Root>
                                    )}

                                    {error && (
                                        <Alert.Root status="error" variant="solid" width="100%">
                                            <Alert.Indicator />
                                            <Alert.Title>{error}</Alert.Title>
                                        </Alert.Root>
                                    )}
                                </VStack>
                            </Dialog.Body>
                            {!success && (
                                <Dialog.Footer>
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        No
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        ml={3}
                                        onClick={handleDelete}
                                        isLoading={isLoading}
                                    >
                                        Yes
                                    </Button>
                                </Dialog.Footer>
                            )}
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
}
