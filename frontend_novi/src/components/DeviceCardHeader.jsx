import { Card, Flex, Text } from '@chakra-ui/react';
import DeleteButton from '../components/DeleteButton';

function DeviceCardHeader({ device, onDeleted }) {
  return (
    <Card.Header bg="#A31D1D" rounded={10} p={4}>
      <Flex justify="center" align="center" height="100%" gap={4}>
        <Text color="white" fontSize="s" fontWeight="bold">
          {device.location_name} - {device.device_type}
        </Text>
        <DeleteButton deviceId={device.device_id} onDeleted={() => onDeleted(device.device_id)} />
      </Flex>
    </Card.Header>
  );
}

export default DeviceCardHeader;
