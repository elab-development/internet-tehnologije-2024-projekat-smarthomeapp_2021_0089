import { Box, Flex } from '@chakra-ui/react';
import { LuThermometerSun } from "react-icons/lu";
import { FaRegLightbulb, FaLock } from "react-icons/fa";


import { useState } from "react";
import AddButton from './AddButton';
import { MdAir } from 'react-icons/md';

export default function DevicesSideBar({ onFilter }) {
    const icons = [
        { id: "thermostat", icon: LuThermometerSun },
        { id: "lightbulb", icon: FaRegLightbulb },
        { id: "airpurifier", icon: MdAir },
        { id: "doorlock", icon: FaLock },
    ];
    const [active, setActive] = useState(null);

    const handleClick = (id) => {
        const newActive = active === id ? null : id;
        setActive(newActive);
        onFilter(newActive); // pošalji null ako deaktiviraš
    };

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
                            onClick={() => handleClick(id)}
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
            <AddButton />
        </Flex>
    )
}
