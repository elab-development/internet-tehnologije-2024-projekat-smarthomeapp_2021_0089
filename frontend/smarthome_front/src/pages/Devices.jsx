import React, { useState, useEffect } from "react";
import axios from "axios";
import ThermostatCard from "../components/ThermostatCard";
import LightbulbCard from "../components/LightBulbCard";
import DoorLockCard from "../components/DoorLockCard";
import UserCard from "../components/UserCard";
import Sidebar from "../components/Sidebar";
import "./Devices.css";
import { useNavigate } from "react-router-dom";

function DevicesPage() {
  const [type, setType] = useState("thermostat"); //pocetni tip uredjaja
  const [devices, setDevices] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDevices = async (deviceType) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/devices/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: 1,
          page_size: 10,
          sort: "asc",
          device_type: deviceType, //dinamicki tip uredjaja koristim
        },
      });
      setDevices(response.data.data);
      setError(null); //resetujem greske
    } catch (error) {
      setError("Failed to fetch devices");
    }
  };

  useEffect(() => {
    if (type === "user") {
      fetchUser(); // Fetch user info when "user" type is selected
    } else {
      fetchDevices(type); // Fetch devices otherwise
    }
  }, [type]);

  const renderDeviceCard = (device) => {
    switch (device.device_type) {
      case "lightbulb":
        return <LightbulbCard key={device.device_id} bulb={device} />;
      case "doorlock":
        return <DoorLockCard key={device.device_id} door={device} />;
      case "thermostat":
        return <ThermostatCard key={device.device_id} thermostat={device} />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login"); // Preusmeravanje na stranicu za prijavu
  };

  if (error) {
    return <div>{error}</div>;
  }

  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch user info");
    }
  };

  return (
    <div className="container">
      <div className="sidebar mx-auto">
        <Sidebar onSelectDevice={(deviceType) => setType(deviceType)} />
      </div>
      <div className="devices-grid-container d-flex align-items-start">
        {type === "user" && user ? (
          <UserCard user={user} onLogout={handleLogout} />
        ) : (
          <div className="row row-cols-3 row-cols-md-3 row-cols-sm-1">
            {devices.map((device) => (
              <div className="col" key={device.device_id}>
                <div className="device-card">{renderDeviceCard(device)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DevicesPage;
