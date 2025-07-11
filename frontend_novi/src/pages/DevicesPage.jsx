import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState, useCallback } from "react";
import DevicesSideBar from '../components/DevicesSideBar';
import ThermostatCard from '../components/cards/ThermostatCard';
import LightbulbCard from '../components/cards/LightbulbCard';
import DoorlockCard from '../components/cards/DoorlockCard';
import AirpurifierCard from '../components/cards/AirpurifierCard';



function Devices() {
  const [devices, setDevices] = useState([]);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState(null);

  const token = localStorage.getItem("access_token");

  const fetchDevices = useCallback(() => {
    let url = "http://localhost:8000/devices/";
    if (deviceTypeFilter) {
      url += `?device_type=${deviceTypeFilter}`;
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDevices(data?.data ?? []))
      .catch(err => {
        console.error("Failed to load devices:", err);
        setDevices([]);
      });
  }, [deviceTypeFilter, token]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Renderuje kartice na osnovu tipa
  const renderDeviceCard = (device) => {
    switch (device.device_type) {
      case "thermostat":
        return <ThermostatCard key={device.device_id} device={device} />;
      case "lightbulb":
        return <LightbulbCard key={device.device_id} device={device} />;
      case "airpurifier":
        return <AirpurifierCard key={device.device_id} device={device} />;
      case "doorlock":
        return <DoorlockCard key={device.device_id} device={device} />;
      default:
        return null;
    }
  };


  return (<Flex wrap='wrap' rowGap={'5'}>
    <DevicesSideBar onFilter={setDeviceTypeFilter} />
    <Flex wrap="wrap" gap={3} width="100%" flex="1" p={3}>
      {devices.map(device => (
        <Box key={device.device_id} minWidth="260px">
          {renderDeviceCard(device)}
        </Box>
      ))}
    </Flex>

  </Flex>);


}


export default Devices;


/*    <SimpleGrid columnGap="5" rowGap="5" minChildWidth={260} width="100%" flex="1" justifyItems="start">


      {devices.map(device => renderDeviceCard(device))}



    </SimpleGrid>*/