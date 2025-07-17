import { useState } from "react";
import {
  Button,
  Dialog,
  Portal,
  Select,
  Box,
  VStack,
  Alert,
  createListCollection,
  Text,
} from "@chakra-ui/react";

const AddDeviceDialog = ({ isOpen, onClose, onCreate }) => {
  const [selectedLocation, setSelectedLocation] = useState([]); // ovde je lista jer chakra to zahteva(dialog je multiple select)
  const [selectedDeviceType, setSelectedDeviceType] = useState([]);//isto
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({
    location: false,
    deviceType: false,
  });

  const locationCollection = createListCollection({ //pravila sam kolekcije jer su tako i u chakra docsu
    items: [
      { label: "Living room", value: "Living room" },
      { label: "Kitchen", value: "Kitchen" },
      { label: "Kids room", value: "Kids room" },
      { label: "Guest room", value: "Guest room" },
      { label: "Main room", value: "Main room" },
    ],
  });

  const deviceTypeCollection = createListCollection({
    items: [
      { label: "Lightbulb", value: "lightbulb" },
      { label: "Thermostat", value: "thermostat" },
      { label: "Air Purifier", value: "airpurifier" },
      { label: "Door Lock", value: "doorlock" },
    ],
  });

  const validate = () => {
    const newErrors = {
      location: selectedLocation.length === 0,
      deviceType: selectedDeviceType.length === 0,
    };
    setErrors(newErrors);
    return !newErrors.location && !newErrors.deviceType;
  };

  const handleCreate = () => {
    if (!validate()) return;

    onCreate({
      location: selectedLocation[0], //nama treba samo jedan selektovan
      deviceType: selectedDeviceType[0], 
    });
    setShowSuccess(true);
    setTimeout(() => {
      resetForm();
      onClose();
    }, 2000);
  };

  const resetForm = () => {
    setSelectedLocation([]); // reset na praznu listu
    setSelectedDeviceType([]); 
    setErrors({ location: false, deviceType: false });
    setShowSuccess(false);
  };

  return (
    <Dialog.Root open={isOpen} onClose={() => { resetForm(); onClose(); }}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add New Device</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {showSuccess ? (
                <Alert.Root status="success" variant="subtle">
                  <Alert.Indicator />
                  <Alert.Title>Successfully created!</Alert.Title>
                </Alert.Root>
              ) : (
                <VStack spacing={4} mb={4}>
                  <Box width="100%">
                    <Select.Root
                      collection={deviceTypeCollection}
                      value={selectedDeviceType}
                      onValueChange={(details) => {
                        setSelectedDeviceType(details.value);
                        setErrors((prev) => ({ ...prev, deviceType: false }));
                      }}
                      invalid={errors.deviceType}
                    >
                      <Select.HiddenSelect />
                      <Select.Label>Device type *</Select.Label>
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Add new device" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {deviceTypeCollection.items.map((device) => (
                            <Select.Item item={device} key={device.value}>
                              {device.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                    {errors.deviceType && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        Device type is required
                      </Text>
                    )}
                  </Box>

                  <Box width="100%">
                    <Select.Root
                      collection={locationCollection}
                      value={selectedLocation}
                      onValueChange={(details) => {
                        setSelectedLocation(details.value);
                        setErrors((prev) => ({ ...prev, location: false }));
                      }}
                      invalid={errors.location}
                    >
                      <Select.HiddenSelect />
                      <Select.Label>Location *</Select.Label>
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Select location" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {locationCollection.items.map((location) => (
                            <Select.Item item={location} key={location.value}>
                              {location.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>

                      </Select.Positioner>
                    </Select.Root>
                    {errors.location && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        Location is required
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
                >
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleCreate}>
                  Create
                </Button>
              </Dialog.Footer>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AddDeviceDialog;