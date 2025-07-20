import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState, useCallback } from "react";
import DevicesSideBar from '../components/DevicesSideBar';
import ThermostatCard from '../components/cards/ThermostatCard';
import LightbulbCard from '../components/cards/LightbulbCard';
import DoorlockCard from '../components/cards/DoorlockCard';
import AirpurifierCard from '../components/cards/AirpurifierCard';
import DevicesUpperBar from '../components/DevicesUpperBar';



function Devices() {
  const [devices, setDevices] = useState([]);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);
  const [locations, setLocations] = useState([]);

  const token = localStorage.getItem("access_token");

  const fetchDevices = useCallback(() => {
    if (!token) return;
    let url = "http://localhost:8000/devices/";
    const params = new URLSearchParams();

    if (deviceTypeFilter) params.append("device_type", deviceTypeFilter);
    if (locationFilter) params.append("location_id", locationFilter);

    url += `?${params.toString()}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDevices(data?.data ?? []))
      .catch(err => {
        console.error("Failed to load devices:", err);
        setDevices([]);
      });
  }, [deviceTypeFilter, locationFilter, token]);


  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    const fetchUserAndLocations = async () => {
      if (!token) return;

      try {
        const userRes = await fetch("http://localhost:8000/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!userRes.ok) throw new Error("Failed to fetch user");

        const userData = await userRes.json();

        const locRes = await fetch(`http://localhost:8000/users/${userData.user_id}/locations`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!locRes.ok) throw new Error("Failed to fetch locations");

        const locData = await locRes.json();
        setLocations(locData);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchUserAndLocations();
  }, [token]);



  const handleDeviceDeleted = (deletedId) => {
    setDevices(prev => prev.filter(device => device.device_id !== deletedId));
  };

  const handleDeviceAdded = (newDevice) => {
    setDevices(prev => [...prev, newDevice]);
  };


  // Renderuje kartice na osnovu tipa
  const renderDeviceCard = (device) => {
    const commonProps = { device, onDeleted: handleDeviceDeleted };

    switch (device.device_type) {
      case "thermostat":
        return <ThermostatCard {...commonProps} />;;
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
  )


}


export default Devices;