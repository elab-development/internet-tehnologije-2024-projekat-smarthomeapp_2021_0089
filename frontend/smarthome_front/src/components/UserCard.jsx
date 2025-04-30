import React from "react";
import "./UserCard.css";

const UserCard = ({ user, onLogout }) => {
  return (
    <div className="card user-card mx-auto">
      <div className="card-header">
        <h4>User info</h4>
      </div>
      <div className="card-body">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Last name:</strong> {user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserCard;
