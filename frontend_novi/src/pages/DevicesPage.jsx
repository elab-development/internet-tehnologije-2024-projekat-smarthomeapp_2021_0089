import { Box, Flex } from '@chakra-ui/react';
import { useState } from "react";
import DevicesSideBar from '../components/DevicesSideBar';
import ThermostatCard from '../components/cards/ThermostatCard';
import LightbulbCard from '../components/cards/LightbulbCard';
import DoorlockCard from '../components/cards/DoorlockCard';
import AirpurifierCard from '../components/cards/AirpurifierCard';
import DevicesUpperBar from '../components/DevicesUpperBar';
import { useDevices } from '../hooks/useDevices';
import { useLocations } from '../hooks/useLocations';

function Devices() {
  const [deviceTypeFilter, setDeviceTypeFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);

  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { devices, setDevices } = useDevices(token, deviceTypeFilter, locationFilter);
  const { locations } = useLocations(token);

  // Handlers for device add/delete
  const handleDeviceDeleted = (deletedId) => {
    setDevices(prev => prev.filter(device => device.device_id !== deletedId));
  };

  const handleDeviceAdded = (newDevice) => {
    setDevices(prev => [...prev, newDevice]);
  };

  const renderDeviceCard = (device) => {
    const commonProps = { device, onDeleted: handleDeviceDeleted };

    switch (device.device_type) {
      case "thermostat":
        return <ThermostatCard {...commonProps} />;
      case "lightbulb":
        return <LightbulbCard {...commonProps} />;
      case "airpurifier":
        return <AirpurifierCard {...commonProps} />;
      case "doorlock":
        return <DoorlockCard {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Flex align="flex-start" width="100%">
      <DevicesSideBar
        onFilter={setDeviceTypeFilter}
        onDeviceAdded={handleDeviceAdded}
        role={user.role}
      />

      <Box flex="1" p={3}>
        <DevicesUpperBar onLocationFilter={setLocationFilter} locations={locations} />

        <Flex wrap="wrap" gap={3}>
          {devices.map((device) => (
            <Box key={device.device_id} minWidth="260px">
              {renderDeviceCard(device)}
            </Box>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}

export default Devices;
