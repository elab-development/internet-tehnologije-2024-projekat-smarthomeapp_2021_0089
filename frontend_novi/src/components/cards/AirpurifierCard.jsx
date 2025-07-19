import { useState } from "react";
import {
  Card,
  Flex,
  Text,
  HStack,
  Switch,
  IconButton, Icon
} from "@chakra-ui/react";
import { MdAir } from "react-icons/md";
import { TbCarFan1, TbCarFan2, TbCarFan3 } from "react-icons/tb";
import DeviceCardHeader from "../DeviceCardHeader";

function AirpurifierCard({ device, onDeleted }) {
  const [isOn, setIsOn] = useState(device.status === "on")
  const [airQuality, setAirQuality] = useState(device.air_quality);
  const [fanSpeed, setFanSpeed] = useState(device.fan_speed);

  let randomAQI = device.airQuality;
  const handleToggle = (isOn) => {
    setIsOn(isOn);
    if (isOn) {
      randomAQI = parseFloat((Math.random() * 4 + 1).toFixed(2));
      setAirQuality(randomAQI);
    }
    //slanje podataka na back
  };

  const handleFanSpeedChange = (val) => {
    setFanSpeed(val);
    // slanje podataka na back
  };


  return (
    <Card.Root height='230px' width='280px'>
      <DeviceCardHeader device={device} onDeleted={onDeleted} />
      <Card.Body bg="white" rounded={10} p={4}>
        <Flex width="100%" align='start'>
          <Switch.Root
            checked={isOn}
            onCheckedChange={(e) => handleToggle(e.checked)}
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label />
          </Switch.Root></Flex>
        <Flex direction="column" align="center" gap={3}>
          <HStack>
            <Text textStyle='xl' fontWeight="bold">{airQuality} AQI</Text>
            <Icon
              boxSize={'30px'}
              color={"black"}

            ><MdAir /></Icon>
          </HStack>
          <HStack spacing={4}>
            <IconButton
              onClick={() => setFanSpeed(1)}
              colorPalette={fanSpeed === 1 ? 'blue' : 'gray'}
              variant={fanSpeed === 1 ? 'solid' : 'outline'}
              disabled={!isOn}
            ><TbCarFan1 /></IconButton>
            <IconButton
              onClick={() => setFanSpeed(2)}
              colorPalette={fanSpeed === 2 ? 'blue' : 'gray'}
              variant={fanSpeed === 2 ? 'solid' : 'outline'}
              disabled={!isOn}
            ><TbCarFan2 /></IconButton>
            <IconButton
              onClick={() => setFanSpeed(3)}
              colorPalette={fanSpeed === 3 ? 'blue' : 'gray'}
              variant={fanSpeed === 3 ? 'solid' : 'outline'}
              disabled={!isOn}
            > <TbCarFan3 /> </IconButton>
          </HStack>

        </Flex>

      </Card.Body>


    </Card.Root>
  );
}

export default AirpurifierCard;
