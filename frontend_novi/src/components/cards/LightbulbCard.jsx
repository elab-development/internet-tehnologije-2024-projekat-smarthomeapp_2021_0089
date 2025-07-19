import {
  Card,
  Slider,
  Icon,
  Switch,
  HStack,
  Flex,
  ColorPicker,
  Portal,
  parseColor,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegLightbulb } from "react-icons/fa";
import DeviceCardHeader from "../DeviceCardHeader";
import { updateDevice } from "../../api/deviceApi";

function LightbulbCard({ device, onDeleted }) {
  const [color, setColor] = useState(device.color || "rgba(255, 255, 0, 1)");
  const [brightness, setBrightness] = useState(device.brightness);
  const [isOn, setIsOn] = useState(device.status === "on");

  // useEffect(() => {
  //   setColor(device.color || "rgba(255, 255, 0, 1)");
  //   setBrightness(device.brightness ?? 100);
  //   setIsOn(device.status === "on");
  // }, [device]);

  const handleToggle = (checked) => {
    setIsOn(checked);
    updateDevice(device.device_id, {
      status: checked ? "on" : "off",
    });
  };

  const handleColorChange = (colorValue) => {
    // Chakra ColorPicker ima metodu valueAsString koja vraca rgba string
    setColor(colorValue.valueAsString);
    if (isOn) {
      updateDevice(device.device_id, {
        color: colorValue.valueAsString,
      });
    }
  };

  const handleBrightnessChange = (value) => {
    const newBrightness = value[0];
    setBrightness(newBrightness);
    updateDevice(device.device_id, {
      brightness: newBrightness,
    });
  };

  return (
    <Card.Root height="230px" width="280px">
      <DeviceCardHeader device={device} onDeleted={onDeleted} />
      <Card.Body bg="white" rounded={10} p={4}>
        <Flex width="100%" align="center" justifyContent={"space-between"}>
          <Switch.Root
            checked={isOn}
            onCheckedChange={(e) => handleToggle(e.checked)}
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label />
          </Switch.Root>

          <ColorPicker.Root
            value={parseColor(color || "rgba(255, 255, 0, 1)")}
            onValueChange={handleColorChange}
            maxW="200px"
            size="sm"
            disabled={!isOn}
          >
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
          <Icon
            flex="1"
            boxSize={"60px"}
            color={isOn ? color : "grey.200"}
            opacity={isOn ? brightness / 100 : 0.4}
          >
            <FaRegLightbulb />
          </Icon>
          <Slider.Root
            min={0}
            max={100}
            defaultValue={[device.brightness]}
            onValueChange={({ value }) => handleBrightnessChange(value)}
            onValueChangeEnd={({ value }) => handleBrightnessChange(value)}
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
