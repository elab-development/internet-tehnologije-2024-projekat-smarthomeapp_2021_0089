import { Flex, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function BreadcrumbNav({
  locationFilter,
  deviceTypeFilter,
  onResetAll,
  onResetTypeOnly,
  locations,
}) {
  const locationName =
    typeof locationFilter === "number"
      ? locations.find((loc) => loc.location_id === locationFilter)?.name
      : null;

  return (
    <Flex fontWeight="medium" fontSize="sm" mb={4} gap={2} align="center">
      <Link as={RouterLink} to="/main/dashboard">
        Home
      </Link>
      <Text>/</Text>

      <Link as="button" onClick={onResetAll}>
        Devices
      </Link>

      {locationName && (
        <>
          <Text>/</Text>
          <Link as="button" onClick={onResetTypeOnly}>
            {locationName}
          </Link>
        </>
      )}

      {deviceTypeFilter && (
        <>
          <Text>/</Text>
          <Text textTransform="capitalize">{deviceTypeFilter}</Text>
        </>
      )}
    </Flex>
  );
}
