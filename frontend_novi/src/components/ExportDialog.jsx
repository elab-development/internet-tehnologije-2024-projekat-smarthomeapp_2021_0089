import { useState } from "react";
import {
  Button,
  Dialog,
  Portal,
  Box,
  VStack,
  Text,
  Alert,
  createListCollection,
  Select,
} from "@chakra-ui/react";

const ExportDialog = ({ isOpen, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatCollection = createListCollection({
    items: [
      { label: "CSV", value: "csv" },
      { label: "PDF", value: "pdf" },
    ],
  });

  const validate = () => {
    const hasError = selectedFormat.length === 0;
    setError(hasError);
    return !hasError;
  };

  const handleExport = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token missing");

      const response = await fetch(
        `http://localhost:8000/devices/export/?format=${selectedFormat[0]}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to export data");
      }

      const blob = await response.blob();
      const filename =
        selectedFormat[0] === "csv" ? "devices.csv" : "devices.pdf";

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setShowSuccess(true);

      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } catch (error) {
      setError(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFormat([]);
    setError(false);
    setShowSuccess(false);
    setIsLoading(false);
  };

  return (
    <Dialog.Root
      open={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Export Devices</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {showSuccess ? (
                <Alert.Root status="success" variant="subtle">
                  <Alert.Indicator />
                  <Alert.Title>Export successful!</Alert.Title>
                </Alert.Root>
              ) : (
                <VStack spacing={4} mb={4}>
                  <Box width="100%">
                    <Select.Root
                      collection={formatCollection}
                      value={selectedFormat}
                      onValueChange={(details) => {
                        setSelectedFormat(details.value);
                        setError(false);
                      }}
                      invalid={error}
                    >
                      <Select.HiddenSelect />
                      <Select.Label>Export Format *</Select.Label>
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Select format" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {formatCollection.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                    {error && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        Format is required
                      </Text>
                    )}
                  </Box>
                </VStack>
              )}
            </Dialog.Body>
            {!showSuccess && (
              <Dialog.Footer>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleExport}
                  isLoading={isLoading}
                  loadingText="Exporting"
                >
                  Export
                </Button>
              </Dialog.Footer>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ExportDialog;
