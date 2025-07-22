import {
  Select,
  Box,
  createListCollection,
  Flex
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import ExportButton from './ExportButton';

export default function DevicesUpperBar({ locations, onLocationFilter }) {
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [errors, setErrors] = useState({ location: false });

  // kreira kolekciju samo kad se promeni locations
  const locationCollection = useMemo(() => {
  if (!locations || locations.length === 0) {
    return createListCollection({ items: [] });
  }
  return createListCollection({
    items: [
      { label: "All locations", value: "" }, // ova stavka uklanja filter
      ...locations.map(loc => ({
        label: loc.name,
        value: loc.location_id.toString()
      }))
    ]
  });
}, [locations]);


  return (
  <Flex width="100%" justifyContent={'space-between'}>
    <Box flex="1" maxW="300px">
      <Select.Root
        collection={locationCollection}
        value={selectedLocation}
        onValueChange={(details) => {
          setSelectedLocation(details.value);
          setErrors(prev => ({ ...prev, location: false }));

          const parsed = details.value ? parseInt(details.value) : null;
          onLocationFilter(parsed);
        }}
        invalid={errors.location}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Filter by location" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {locationCollection.items.map(loc => (
              <Select.Item item={loc} key={loc.value}>
                {loc.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </Box>

    <ExportButton/>
  </Flex>
  );
}
