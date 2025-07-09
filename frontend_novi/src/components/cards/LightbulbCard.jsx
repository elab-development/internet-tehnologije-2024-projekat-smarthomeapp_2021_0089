import {
    Card,
    Text,
    Slider,
    Icon,
    Switch,
    HStack,
    Flex,
    ColorPicker,
    Portal,
    parseColor
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaRegLightbulb } from 'react-icons/fa';

function LightbulbCard({ device }) {
    const [color, setColor] = useState(device.color);
    const [brightness, setBrightness] = useState(device.brightness);
    const [isOn, setIsOn] = useState(device.status === "on")


    return (
        <Card.Root height='230px' width='260px'>
            <Card.Header bg="#A31D1D" rounded={10} p={4}>
                <Flex justify="center" align="center" height="100%">
                    <Text color="white" fontSize="xl" fontWeight="bold">
                        {device.location_name} - {device.device_type}
                    </Text>
                </Flex>
            </Card.Header>
            <Card.Body bg="white" rounded={10} p={4}>
                <Flex width="100%" align="center" justifyContent={'space-between'}>
                    <Switch.Root
                        checked={isOn}
                        onCheckedChange={(e) => setIsOn(e.checked)}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                        <Switch.Label />
                    </Switch.Root>

                    <ColorPicker.Root value={parseColor(color)}
                        onValueChange={(e) => setColor(e.valueAsString)}
                        maxW="200px" size="sm"
                        disabled={!isOn}>
                        <ColorPicker.HiddenInput />
                        <ColorPicker.Control>
                            <ColorPicker.Trigger />
                        </ColorPicker.Control>
                        <Portal>
                            <ColorPicker.Positioner>
                                <ColorPicker.Content>
                                    <ColorPicker.Area />
                                    <HStack>
                                        <ColorPicker.EyeDropper size="xs" variant="outline" />
                                        <ColorPicker.Sliders />
                                    </HStack>
                                </ColorPicker.Content>
                            </ColorPicker.Positioner>
                        </Portal>
                    </ColorPicker.Root>
                </Flex>
                <Flex direction="column" align="center" gap={3}>
                    <Icon flex="1"
                        boxSize={'60px'}
                        color={isOn ? color : 'grey.200'}
                        opacity={isOn ? brightness / 100 : 0.4}
                    ><FaRegLightbulb /></Icon>
                    <Slider.Root
                        min={0}
                        max={100}
                        defaultValue={[device.brightness]}
                        onValueChange={({ value }) => setBrightness(value)}
                        onValueChangeEnd={({ value }) => setBrightness(value)}
                        step={1}
                        aria-label="brightness"
                        width="200px"
                        colorPalette="yellow"
                        disabled={!isOn}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>

                </Flex>
            </Card.Body>


        </Card.Root>
    );
}

export default LightbulbCard;