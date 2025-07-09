import { Box, Flex, SimpleGrid} from '@chakra-ui/react';
import { useEffect, useState } from "react";
import DevicesSideBar from '../components/DevicesSideBar';
import ThermostatCard from '../components/cards/ThermostatCard';
import LightbulbCard from '../components/cards/LightbulbCard';
import DoorlockCard from '../components/cards/DoorlockCard';



function Devices() {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        fetch("/db/data.json")
            .then((res) => res.json())
            .then((json) => setDevices(json.data));
    }, []);

    const devic = {
        device_id: 3,
        location_name: "Kitchen",
        device_type: "thermostat",
        status: "heating",
        temperature: 27,
        brightness: null,
        color: null
    };

    const deviceLight=         {
            "device_id": 4,
            "location_name": "Living room",
            "device_type": "lightbulb",
            "status": "on",
            "temperature": null,
            "brightness": 60,
            "color": "yellow"
        };

    const deviceDoor=        {
            "device_id": 5,
            "location_name": "Kitchen",
            "device_type": "doorlock",
            "status": "locked",
            "temperature": null,
            "brightness": null,
            "color": null
        };

    /*return (
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
    );*/

        return (<Flex>
            <DevicesSideBar/>
            <SimpleGrid columnGap="5" rowGap="5" minChildWidth={260} width="100%" flex="1">

                <ThermostatCard device={devic}/>
                <ThermostatCard device={devic}/>
                <ThermostatCard device={devic}/>
                <ThermostatCard device={devic}/>
                <LightbulbCard device={deviceLight}/>
                <DoorlockCard device={deviceDoor}/>


                </SimpleGrid>
                </Flex>);
    

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