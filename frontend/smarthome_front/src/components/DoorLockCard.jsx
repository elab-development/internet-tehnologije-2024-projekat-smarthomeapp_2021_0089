import React, { useState } from "react";
import { FaLock, FaLockOpen, FaDoorClosed, FaDoorOpen } from "react-icons/fa"; // Ikonice za zaključavanje i vrata

function DoorLockCard({ door }) {
  const [status, setStatus] = useState(door.status);

  const toggleStatus = () => {
    setStatus((prevStatus) => (prevStatus === "locked" ? "unlocked" : "locked"));
  };

  return (
    <div className="card text-bg-light mb-3" style={{ maxWidth: "20rem" }}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{door.location_name}</h5>
        <span
          className={`badge rounded-pill ${status === "locked" ? "bg-danger" : "bg-success"}`}
          onClick={toggleStatus}
          style={{ cursor: "pointer" }}
          title="Click to toggle status"
        >
          {status === "locked" ? (
            <FaLock size={20} className="me-1" />
          ) : (
            <FaLockOpen size={20} className="me-1" />
          )}
        </span>
      </div>
      <div className="card-body text-center">
        {status === "locked" ? (
          <FaDoorClosed size={50} color="#f44336" />
        ) : (
          <FaDoorOpen size={50} color="#4caf50" />
        )}
      </div>
    </div>
  );
}

export default DoorLockCard;
