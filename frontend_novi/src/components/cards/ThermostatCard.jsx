import {
  Card,
  Text,
  Slider,
  IconButton,
  VStack,
  HStack,
  Flex,
  Button
} from '@chakra-ui/react';
import { FaSnowflake, FaPause, FaFire } from 'react-icons/fa';
import { useState } from 'react';

function ThermostatCard({ device }) {

  const [wantedTemp, setWantedTemp] = useState(device.temperature);
  const [status, setStatus] = useState(device.status);

  // promena slidera - vraca niz
  const handleTemperatureChange = (value) => {
    setWantedTemp(value); // 'value' je niz, npr [21]
  };

  return (
    <Card.Root height="230px" width='280px'>
      <Card.Header bg="#A31D1D" rounded={10} p={4}>
        <Flex justify="center" align="center" height="100%">
          <Text color="white" fontSize="xl" fontWeight="bold">
            {device.location_name} - {device.device_type}
          </Text>
        </Flex>
      </Card.Header>
      <Card.Body bg="white" p={4} rounded={10}>
        <VStack align="center" spacing={4}>
          <Text textStyle='xl' fontWeight="bold">{wantedTemp}°C</Text>
          <HStack>
            <Text textStyle='xs'>Current temperature:</Text>
            <Text textStyle='xs'>{device.temperature}°C</Text>
          </HStack>
                  <Slider.Root
                      min={15}
                      max={30}
                      defaultValue={[device.temperature]}
                      onValueChange={({ value }) => handleTemperatureChange(value)}
                      onValueChangeEnd={({ value }) => handleTemperatureChange(value)}
                      step={1}
                      aria-label="Temperature slider"
                      width="200px"
                  >
                      <Slider.Control>
                          <Slider.Track>
                              <Slider.Range />
                          </Slider.Track>
                          <Slider.Thumbs />
                      </Slider.Control>
                  </Slider.Root>
          <HStack spacing={4}>
            <IconButton
              aria-label="Cooling"
              onClick={() => setStatus('cooling')}
              colorPalette={status === 'cooling' ? 'blue' : 'gray'}
              variant={status === 'cooling' ? 'solid' : 'outline'}
            ><FaSnowflake /></IconButton>
            <IconButton
              aria-label="Idle"
              onClick={() => setStatus('idle')}
              colorPalette={status === 'idle' ? 'yellow' : 'gray'}
              variant={status === 'idle' ? 'solid' : 'outline'}
            ><FaPause /></IconButton>
            <IconButton
              aria-label="Heating"
              onClick={() => setStatus('heating')}
              colorPalette={status === 'heating' ? 'red' : 'gray'}
              variant={status === 'heating' ? 'solid' : 'outline'}
            > <FaFire /> </IconButton>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export default ThermostatCard;