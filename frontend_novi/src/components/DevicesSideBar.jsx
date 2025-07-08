import { Box, Flex } from '@chakra-ui/react';
import { LuThermometerSun } from "react-icons/lu";
import { FaRegLightbulb, FaLock } from "react-icons/fa";
import { PiOvenBold } from "react-icons/pi";

import { useState } from "react";
import AddButton from './AddButton';

export default function DevicesSideBar() {
    const icons = [
        { id: "thermo", icon: LuThermometerSun },
        { id: "light", icon: FaRegLightbulb },
        { id: "oven", icon: PiOvenBold },
        { id: "lock", icon: FaLock },
    ];
    const [active, setActive] = useState(null);

    return (
        <Flex direction={'column'} align="center">
            <Box
                bg="#A31D1D"
                p={4}
                borderRadius="xl"
                m={4}
                height="fit-content"
            >
                <Flex direction="column" gap={4}>
                    {icons.map(({ id, icon: Icon }) => (
                        <Box
                            key={id}
                            as="button"
                            onClick={() => setActive(id)}
                            color={active === id ? "#fcb407" : "#faf6ed"}
                            transition="transform 0.2s ease"
                            transform={active === id ? "scale(1.2)" : "scale(1.0)"}
                            _hover={{
                                transform: "scale(1.1)",
                                color: "#fcb407",
                            }}
                        >
                            <Icon size={30} />
                        </Box>
                    ))}
                </Flex>
            </Box>
            <AddButton/>
        </Flex>
    )
}
