import React, { useState } from 'react';
import './ThermostatCard.css';

//destrukturiranje objekta
const ThermostatCard = ({ thermostat }) => {
  const [temperature, setTemperature] = useState(22); // Početna temperatura

  // Funkcija za promenu temperature
  const handleTemperatureChange = (event) => {
    setTemperature(event.target.value); // Ažuriraj temperaturu na osnovu slajdera
  };

  return (
    <div className="thermostat-card">
      <div className="card-header">
        <h3>{thermostat.location}</h3>
        <span className={`status ${thermostat.status.toLowerCase()}`}>{thermostat.status}</span>
      </div>
      <div className="card-body">
        <div className="temperature-control">
          <div className="temperature-display">
            <span>{temperature}°C</span>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="40"
              value={temperature}
              onChange={handleTemperatureChange}
              className="temperature-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermostatCard;
