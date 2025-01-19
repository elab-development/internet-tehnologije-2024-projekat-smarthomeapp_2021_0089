import React, { useState } from "react";
import { FaLightbulb,FaPaintBrush } from "react-icons/fa";
import "./LightBulbCard.css"; // Dodaj poseban CSS za stilove

function LightbulbCard({ bulb }) {
  const [status, setStatus] = useState(bulb.status);
  const [color, setColor] = useState(bulb.color);
  const [brightness, setBrightness] = useState(bulb.brightness);

  // Promena statusa
  const toggleStatus = () => {
    setStatus((prevStatus) => (prevStatus === "on" ? "off" : "on"));
  };

  // Promena boje
  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleBrightness = (event) => {
    setBrightness(event.target.value);
  };

  return (
    <div className="card text-bg-light mb-3 lightbulb-card" style={{ maxWidth: "20rem" }}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{bulb.location_name}</h5>
        <span
          className={`badge rounded-pill ${status === "on" ? "bg-success" : "bg-danger"}`}
          onClick={toggleStatus}
          style={{
            cursor: "pointer",
            padding: "0.3rem 0.8rem",
            fontSize: "1rem",
          }}
          title="Click to toggle status"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="card-body text-center">
        <FaLightbulb
          size={60}
          style={{
            color: status === "on" ? color : "#d3d3d3", // Koristi boju ako je ukljuceno, siva ako nije
            transition: "color 0.3s ease",
          }}
          onClick={toggleStatus} // Omogući promenu statusa klikom na ikonicu
          title="Click to toggle light"
          className="lightbulb-icon"
        />
        <div className="mt-3">
          <strong>Brightness:</strong> {brightness}%
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={handleBrightness}
              className="brightness-slider"
            />
          </div>
        </div>
        <div className="mt-3">
          <FaPaintBrush size={20} style={{ marginRight: "5px", marginBottom: "15px" }}></FaPaintBrush>
          <input
            type="color"
            id="colorPicker"
            value={color}
            onChange={handleColorChange}
            className="form-control form-control-color d-inline-block"
            style={{
              width: "40px",
              height: "40px",
              marginLeft: "10px",
              cursor: "pointer",
              border: "none",
              padding: "0",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LightbulbCard;
