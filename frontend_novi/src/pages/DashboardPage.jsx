import { Tabs } from "@chakra-ui/react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Box} from "@chakra-ui/react";
export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname.includes("/weather") ? "weather" : "statistics";

  return (
    <>
    <Box p={4}>
      <Tabs.Root
        defaultValue={currentTab}
        value={currentTab}
        onValueChange={(value) => navigate(`/main/dashboard/${value.value}`)}
        variant="outline"
        colorPalette={"orange"}
      >
        <Tabs.List>
          <Tabs.Trigger value="statistics">Statistics</Tabs.Trigger>
          <Tabs.Trigger value="weather">Weather</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>

        <Tabs.Content value="statistics">
        </Tabs.Content>

        <Tabs.Content value="weather">
        </Tabs.Content>
      </Tabs.Root>
    </Box>
    <Outlet/></>
  );
}
