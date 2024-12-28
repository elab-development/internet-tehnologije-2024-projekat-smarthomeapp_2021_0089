import React, { useState } from 'react';
import ThermostatCard from './ThermostatCard';
import Sidebar from './Sidebar';
import './Devices.css';

function Devices() {
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
  };

  const thermostats = [
    {
      temperature: 23,
      status: "on",
      location: "bathroom"
    },
    {
      temperature: 12,
      status: "on",
      location: "room"
    },
    {
      temperature: 16,
      status: "on",
      location: "kitchen"
    },
  ];

  return (
    <div className="devices-container">
      {/* Sidebar sa ikonama */}
      <Sidebar onSelectDevice={handleSelectDevice} />

      <div className="devices-glass-container">
        <div className="devices-list">
          <ThermostatCard thermostat={thermostats[0]} />
          <ThermostatCard thermostat={thermostats[1]} />
          <ThermostatCard thermostat={thermostats[2]} />
        </div>
      </div>
    </div>
  );
};

export default Devices;
