import React, { useState } from 'react';
import { FaTemperatureHigh, FaLightbulb, FaUnlockAlt } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ onSelectDevice }){
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleClick = (device) => {
    setSelectedDevice(device); // Postavi trenutni odabrani uređaj
    onSelectDevice(device); // poziva fju roditeljske komponente
  };

  return (
    <div className="sidebar">

      <button
        className={selectedDevice === 'thermostat' ? 'active' : ''}
        onClick={() => handleClick('thermostat')}
      >
        <FaTemperatureHigh size={30} />
      </button>

      <button
        className={selectedDevice === 'lightbulb' ? 'active' : ''}
        onClick={() => handleClick('lightbulb')}
      >
        <FaLightbulb size={30} />
      </button>

      <button
        className={selectedDevice === 'doorlock' ? 'active' : ''}
        onClick={() => handleClick('doorlock')}
      >
        <FaUnlockAlt size={30} />
      </button>
    </div>
  );
};

export default Sidebar;
