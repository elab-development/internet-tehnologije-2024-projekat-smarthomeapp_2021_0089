import { BsDoorClosedFill, BsDoorOpenFill } from "react-icons/bs";
import { Card, Flex, Text, Icon } from '@chakra-ui/react';
import { useState } from 'react';
import DeviceCardHeader from "../DeviceCardHeader";

function DoorlockCard({ device, onDeleted }) {
    const [status, setStatus] = useState(device.status);

    const handleToggle = () => {
        setStatus((prev) => (prev === "unlocked" ? "locked" : "unlocked"));
    };

    return (
        <Card.Root height="230px" width='280px'>
<DeviceCardHeader device={device} onDeleted={onDeleted} />
            <Card.Body bg="white" p={4} rounded={10}>
                <Flex direction="column" align="center" justify="center" height="100%" gap={3}>
                    <Icon
                        as={status === "unlocked" ? BsDoorOpenFill : BsDoorClosedFill}
                        boxSize={16}
                        cursor="pointer"
                        color={status === "unlocked" ? "green.500" : "gray.700"}
                        onClick={handleToggle}
                    />
                    <Text fontWeight="bold" color="gray.700">
                        Door is {status}
                    </Text>
                </Flex>
            </Card.Body>
        </Card.Root>
    );
}

export default DoorlockCard;
