import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import { useLoaderData } from "react-router-dom"
import { LuThermometerSun } from "react-icons/lu";
import { FaRegLightbulb, FaLock } from "react-icons/fa";
import { PiOvenBold } from "react-icons/pi";

import { useEffect, useState } from "react";

function Devices() {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/db")
            .then((res) => res.json())
            .then((json) => setDevices(json.data));
    }, []);

    return (
        <Flex flexDirection="column">
            <Flex align="center" justify="center" height="80px" gap="10px">
                <LuThermometerSun color="orange" size={30} />
                <FaRegLightbulb color='orange' size={30} />
                <PiOvenBold color='orange' size={30}/>
                <FaLock color='orange' size={30}/>
            </Flex>
            <SimpleGrid  columnGap="5" rowGap="5" minChildWidth={250} >

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
    );
}


export default Devices;