import React, { useState, useEffect } from 'react';
import { FaSun, FaSnowflake, FaWind } from 'react-icons/fa'; // Ikonice za sunce, pahuljicu i vetar
import './ThermostatCard.css';

const ThermostatCard = ({ thermostat }) => {
  const [temperature, setTemperature] = useState(thermostat.temperature); // Početna temperatura
  const [selectedMode, setSelectedMode] = useState(thermostat.status.toLowerCase()); // Početni režim (heating, cooling, idle)

  // Funkcija za promenu temperature
  const handleTemperatureChange = (event) => {
    setTemperature(event.target.value); // Ažuriraj temperaturu na osnovu slajdera
  };

  // Funkcija za selektovanje režima
  const handleModeSelect = (mode) => {
    setSelectedMode(mode); // Postavi selektovani režim
  };

  // Ažuriranje selektovanog režima na osnovu početnog stanja termostata
  useEffect(() => {
    setSelectedMode(thermostat.status.toLowerCase());
  }, [thermostat.status]);

  return (
    <div className="card thermostat-card mx-auto" >
      <div className="card-header">
        <h4>{thermostat.location_name}</h4>
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
              className="form-range"
            />
          </div>

          {/* Dugmadi za režime */}
          <div className="btn-group" role="group" aria-label="Thermostat Modes">
            <button
              type="button"
              className={`btn btn-sm btn-outline-dark ${selectedMode === "heating" ? "active" : ""}`}
              onClick={() => handleModeSelect("heating")}
            >
              <FaSun size={20} /> Heating
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-dark ${selectedMode === "cooling" ? "active" : ""}`}
              onClick={() => handleModeSelect("cooling")}
            >
              <FaSnowflake size={20} /> Cooling
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-dark ${selectedMode === "idle" ? "active" : ""}`}
              onClick={() => handleModeSelect("idle")}
            >
              <FaWind size={20} /> Idle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermostatCard;
