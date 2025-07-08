import { Box, Flex, SimpleGrid} from '@chakra-ui/react';
import { useEffect, useState } from "react";
import DevicesSideBar from '../components/DevicesSideBar';


function Devices() {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        fetch("/db/data.json")
            .then((res) => res.json())
            .then((json) => setDevices(json.data));
    }, []);



    return (
        <Flex>
            <DevicesSideBar/>
            <SimpleGrid columnGap="5" rowGap="5" minChildWidth={250} width="100%" flex="1">

                <Box bg="white" height="200px" border="1px solid"></Box>
                <Box bg="white" height="200px" border="1px solid"></Box>
                <Box bg="white" height="200px" border="1px solid"></Box>
                <Box bg="white" height="200px" border="1px solid"></Box>

                <Box bg="white" height="200px" border="1px solid"></Box>
                <Box bg="white" height="200px" border="1px solid"></Box>
                <Box bg="white" height="200px" border="1px solid"></Box>
                <Box bg="white" height="200px" border="1px solid"></Box>

                <Box bg="white" height="200px" border="1px solid"></Box>
                <Box bg="white" height="200px" border="1px solid"></Box>
                <Box bg="white" height="200px" border="1px solid"></Box>
                <Box bg="white" height="200px" border="1px solid"></Box>
                <Box bg="white" height="200px" border="1px solid"></Box>
            </SimpleGrid>
        </Flex>
    );
}


export default Devices;
/*import { Flex, SimpleGrid} from '@chakra-ui/react';
import { useEffect, useState } from "react";
import DevicesSideBar from '../components/DevicesSideBar';
import DeviceCard from '../components/DeviceCard'

function Devices() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch("/db/data.json")
      .then((res) => res.json())
      .then((json) => setDevices(json.data));
  }, []);

  const handleUpdate = (deviceId, field, value) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.device_id === deviceId ? { ...device, [field]: value } : device
      )
    );
  };

  return (
    <Flex>
      <DevicesSideBar />
      <SimpleGrid columnGap="5" rowGap="5" minChildWidth={250} width="100%" flex="1">
        {devices.map(device => (
          <DeviceCard key={device.device_id} device={device} onUpdate={handleUpdate} />
        ))}
      </SimpleGrid>
    </Flex>
  );
}

export default Devices;*/