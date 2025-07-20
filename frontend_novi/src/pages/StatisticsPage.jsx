import { useState } from 'react';
import { Chart } from "react-google-charts";
import { Button, ButtonGroup, Box,Center,Spinner,Text } from "@chakra-ui/react";
import { useDevices } from '../hooks/useDevices';

function prepareChartData(devices, mode) {
  const rooms = {};

  for (const device of devices) {
    const room = device.location_name;
    if (!rooms[room]) {
      rooms[room] = { temperature: null, air_quality: null };
    }

    if (device.device_type === "thermostat" && rooms[room].temperature === null) {
      rooms[room].temperature = device.temperature;
    }

    if (device.device_type === "airpurifier" && rooms[room].air_quality === null) {
      rooms[room].air_quality = device.air_quality;
    }
  }

  const data = [
    ['Room', mode === 'temperature' ? 'Temperature (°C)' : 'Air Quality Index (AQI)'],
    ...Object.entries(rooms).map(([room, stats]) => [
      room,
      mode === 'temperature'
        ? stats.temperature !== null ? stats.temperature : 0
        : stats.air_quality !== null ? stats.air_quality : 0
    ])
  ];

  return data;
}

export default function StatisticsPage() {
  const token = localStorage.getItem("access_token");
  const { devices, isLoading, error } = useDevices(token);
  const [mode, setMode] = useState('temperature'); // 'temperature' or 'aqi'

  const data = prepareChartData(devices, mode);

  const options = {
    title: mode === 'temperature' ? "Room temperatures" : "Room air quality",
    chartArea: { width: '60%' },
    hAxis: {
      title: mode === 'temperature' ? 'Temperatura (°C)' : 'AQI',
      minValue: 0,
      maxValue: mode === 'temperature' ? 30 : 5
    },
    vAxis: {
      title: 'Rooms',
    },
    bars: 'horizontal',
    colors: [mode === 'temperature' ? '#f39c12' : '#2980b9'],
  };

    if (isLoading) {
    return (
      <Center mt={10}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center mt={10}>
        <Text color="red.500">Failed to load data: {error.message || "Unknown error"}</Text>
      </Center>
    );
  }

  return (
    <Box>
      <ButtonGroup isAttached mb={4}>
        <Button
          onClick={() => setMode('temperature')}
          variant="subtle"
          colorPalette={mode === 'temperature' ? 'orange' : 'gray'}
        >
          Temperature
        </Button>
        <Button
          onClick={() => setMode('aqi')}
          variant="subtle"
          colorPalette={mode === 'aqi' ? 'blue' : 'gray'}
        >
          AQI
        </Button>
      </ButtonGroup>

      <Chart
        chartType="BarChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </Box>
  );
}
