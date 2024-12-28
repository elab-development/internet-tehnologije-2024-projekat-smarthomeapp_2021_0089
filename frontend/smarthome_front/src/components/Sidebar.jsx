import React, { useState } from 'react';
import { FaTemperatureHigh, FaLightbulb, FaUnlockAlt } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ onSelectDevice }){
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleClick = (device) => {
    setSelectedDevice(device); // Postavi trenutni odabrani uređaj
    onSelectDevice(device); // Pozovi funkciju sa roditeljskom komponente
  };

  return (
    <div className="sidebar">

      <button
        className={selectedDevice === 'Thermostat1' ? 'active' : ''}
        onClick={() => handleClick('Thermostat1')}
      >
        <FaTemperatureHigh size={30} />
      </button>

      <button
        className={selectedDevice === 'Light1' ? 'active' : ''}
        onClick={() => handleClick('Light1')}
      >
        <FaLightbulb size={30} />
      </button>

      <button
        className={selectedDevice === 'Fan1' ? 'active' : ''}
        onClick={() => handleClick('Fan1')}
      >
        <FaUnlockAlt size={30} />
      </button>
    </div>
  );
};

export default Sidebar;
