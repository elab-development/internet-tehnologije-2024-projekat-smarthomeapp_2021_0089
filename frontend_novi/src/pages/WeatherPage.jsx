import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Image,
  Spinner,
  Icon,
  Container,
  SimpleGrid,
  Alert
} from "@chakra-ui/react";
import { MdErrorOutline } from "react-icons/md";


function getAqiDescription(aqi) {
  switch (aqi) {
    case 1: return "Good";
    case 2: return "Moderate";
    case 3: return "Unhealthy for Sensitive Groups";
    case 4: return "Unhealthy";
    case 5: return "Very Unhealthy";
    case 6: return "Hazardous";
    default: return "Unknown";
  }
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // uzima grad pomocu ip adrese
    fetch("http://ip-api.com/json/")
      .then((res) => res.json())
      .then((locationData) => {
        const city = locationData.city || "Belgrade";
        // fetchuje sa becka prognozu
        return fetch(`http://localhost:8000/api/weather?city=${city}`);
      })
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch weather data.");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <Box p={10} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
          <Box p={6}>
      <Alert.Root status="error" variant="subtle" colorScheme="red">
        <Alert.Indicator>
          <Icon ><MdErrorOutline/></Icon>
        </Alert.Indicator>
        <Alert.Title>{error}</Alert.Title>
      </Alert.Root>
    </Box>
    );
  }

  const { current, location, forecast } = weatherData;
  const aqi = current.air_quality["us-epa-index"];

  return (
    <Container centerContent py={10}>
      <VStack
        spacing={6}
        bg="blue.50"
        p={8}
        rounded="2xl"
        boxShadow="lg"
        maxW="600px"
        width="100%"
      >
        {/* Current Weather */}
        <Heading size="lg">{location.name}, {location.country}</Heading>

        <HStack spacing={4}>
          <Image src={current.condition.icon} alt="weather icon" boxSize="50px" />
          <Text fontSize="2xl" fontWeight="bold">
            {current.temp_c}°C
          </Text>
        </HStack>

        <Text fontSize="lg" color="gray.700">
          {current.condition.text}
        </Text>

        {/* AQI */}
        <Box textAlign="center">
          <Text fontWeight="semibold">Air Quality Index (AQI)</Text>
          <Text fontSize="xl">{aqi} - {getAqiDescription(aqi)}</Text>
        </Box>

        {/* Prognoza */}
        <Box width="100%">
          <Heading size="md" mb={4}>3-Day Forecast</Heading>
          <SimpleGrid columns={[1, 3]} columnGap="2">
            {forecast.forecastday.map((day) => (
              <Box
                key={day.date}
                bg="white"
                p={4}
                rounded="xl"
                textAlign="center"
                boxShadow="md"
              >
                <Text fontWeight="bold">{day.date}</Text>
                <Image
                  src={day.day.condition.icon}
                  alt="icon"
                  mx="auto"
                  boxSize="50px"
                />
                <Text fontSize="sm">{day.day.condition.text}</Text>
                <Text mt={2}>
                  {day.day.mintemp_c}°C / {day.day.maxtemp_c}°C
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
}
