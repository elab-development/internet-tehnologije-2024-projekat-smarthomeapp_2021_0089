import { Tabs } from "@chakra-ui/react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // provera da li je user admin
    try {
      const userCookie = localStorage.getItem('user');
      if (userCookie) {
        const userData = JSON.parse(userCookie);
        setIsAdmin(userData.role === 'Admin');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setIsAdmin(false);
    }
  }, []);

  const getCurrentTab = () => {
    if (location.pathname.includes("/weather")) return "weather";
    if (location.pathname.includes("/adminpanel")) return "adminpanel";
    return "statistics";
  };

  const currentTab = getCurrentTab();

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
            {isAdmin && <Tabs.Trigger value="adminpanel">Admin Panel</Tabs.Trigger>}
            <Tabs.Indicator />
          </Tabs.List>

          <Tabs.Content value="statistics">
          </Tabs.Content>

          <Tabs.Content value="weather">
          </Tabs.Content>

          {isAdmin && (
            <Tabs.Content value="adminpanel">
            </Tabs.Content>
          )}
        </Tabs.Root>
      </Box>
      <Outlet />
    </>
  );
}