import { Box, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import DevicesSideBar from "../components/DevicesSideBar";
import ThermostatCard from "../components/cards/ThermostatCard";
import LightbulbCard from "../components/cards/LightbulbCard";
import DoorlockCard from "../components/cards/DoorlockCard";
import AirpurifierCard from "../components/cards/AirpurifierCard";
import DevicesUpperBar from "../components/DevicesUpperBar";
import { useDevices } from "../hooks/useDevices";
import { useLocations } from "../hooks/useLocations";
import BreadcrumbNav from "../components/BreadcrumbNav";

function Devices() {
  const [deviceTypeFilter, setDeviceTypeFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);

  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { devices, setDevices } = useDevices(
    token,
    deviceTypeFilter,
    locationFilter
  );
  const { locations } = useLocations(token);

  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 6;

  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = devices.slice(indexOfFirstDevice, indexOfLastDevice);
  const totalPages = Math.ceil(devices.length / devicesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [deviceTypeFilter, locationFilter]);

  const handleDeviceDeleted = (deletedId) => {
    setDevices((prev) =>
      prev.filter((device) => device.device_id !== deletedId)
    );
  };

  const handleDeviceAdded = (newDevice) => {
    setDevices((prev) => [...prev, newDevice]);
  };

  const renderDeviceCard = (device) => {
    const commonProps = { device, onDeleted: handleDeviceDeleted };

    switch (device.device_type) {
      case "thermostat":
        return <ThermostatCard {...commonProps} />;
      case "lightbulb":
        return <LightbulbCard {...commonProps} />;
      case "airpurifier":
        return <AirpurifierCard {...commonProps} />;
      case "doorlock":
        return <DoorlockCard {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Flex align="flex-start" width="100%">
      <DevicesSideBar
        onFilter={setDeviceTypeFilter}
        onDeviceAdded={handleDeviceAdded}
        role={user.role}
      />

      <Box flex="1" p={3}>
        <DevicesUpperBar
          onLocationFilter={setLocationFilter}
          locations={locations}
        />

        <BreadcrumbNav
          locationFilter={locationFilter}
          deviceTypeFilter={deviceTypeFilter}
          onResetAll={() => {
            setLocationFilter(null);
            setDeviceTypeFilter(null);
          }}
          onResetTypeOnly={() => {
            setDeviceTypeFilter(null);
          }}
          locations={locations}
        />

        <Flex direction="column" align="center" mt={6} gap={4}>
  <Flex wrap="wrap" gap={3} justify="center">
    {currentDevices.map((device) => (
      <Box key={device.device_id} minWidth="260px">
        {renderDeviceCard(device)}
      </Box>
    ))}
  </Flex>

  <Flex justify="center" gap={2}>
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      style={{
        padding: "6px 12px",
        backgroundColor: "white",
        color: "black",
        border: "1px solid black",
        borderRadius: "6px",
        cursor: "pointer",
        opacity: currentPage === 1 ? 0.5 : 1,
      }}
    >
      Prev
    </button>

    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        style={{
          fontWeight: "bold",
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid black",
          backgroundColor: currentPage === index + 1 ? "black" : "white",
          color: currentPage === index + 1 ? "white" : "black",
          cursor: "pointer",
        }}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      style={{
        padding: "6px 12px",
        backgroundColor: "white",
        color: "black",
        border: "1px solid black",
        borderRadius: "6px",
        cursor: "pointer",
        opacity: currentPage === totalPages ? 0.5 : 1,
      }}
    >
      Next
    </button>
  </Flex>
</Flex>


      </Box>
    </Flex>
  );
}

export default Devices;
