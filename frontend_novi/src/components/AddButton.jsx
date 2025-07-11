import {
  Menu,
  IconButton,
  Portal
} from "@chakra-ui/react";
import { FaPlus} from "react-icons/fa";

export default function AddButton() {
  return (
    <Menu.Root>

      <Menu.Trigger asChild>
        <IconButton         
        variant="solid"
        bg="#A31D1D"
        _hover={{ bg: "#881818" }}
        _active={{ bg: "#700F0F" }} 
        size="s"
        rounded="full"
        height={10}
        width={10}>
          <FaPlus />
        </IconButton>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-tm">New Thermostat</Menu.Item>
            <Menu.Item value="new-lb">New Lightbulb</Menu.Item>
            <Menu.Item value="new-oven">New Oven</Menu.Item>
            <Menu.Item value="open-dl">New Lock</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
