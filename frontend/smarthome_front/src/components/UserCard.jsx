import React from "react";
import "./UserCard.css";

const UserCard = ({ user, onLogout }) => {
  return (
    <div className="card user-card mx-auto">
      <div className="card-header">
        <h4>Podaci o korisniku</h4>
      </div>
      <div className="card-body">
        <p>
          <strong>Ime:</strong> Andjela
        </p>
        <p>
          <strong>Prezime:</strong> Dimic
        </p>
        <p>
          <strong>Email:</strong> ancika@example.com
        </p>
        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserCard;
