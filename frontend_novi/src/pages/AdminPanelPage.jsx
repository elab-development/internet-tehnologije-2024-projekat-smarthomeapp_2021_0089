"use client";

import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (!error) return;

  const timer = setTimeout(() => setError(null), 3000);
  return () => clearTimeout(timer);
}, [error]);


  // nadji ime role by id
  const getRoleById = (id) => roles.find((r) => r.role_id === id);

  // loaduje users, roles, locations on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("access_token");

        const [rolesRes, locationsRes, usersRes] = await Promise.all([
          fetch("http://localhost:8000/users/roles", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:8000/locations/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:8000/users/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!rolesRes.ok || !locationsRes.ok || !usersRes.ok) {
          throw new Error("Failed to load data");
        }

        const rolesData = await rolesRes.json();
        const locationsData = await locationsRes.json();
        const usersData = await usersRes.json();

        setRoles(Array.isArray(rolesData) ? rolesData : []);
        setLocations(Array.isArray(locationsData) ? locationsData : []);
        setUsers(
          Array.isArray(usersData)
            ? usersData.map((user) => ({
              id: user.user_id,
              name: `${user.name} ${user.lastname}`,
              email: user.mail,
              roleId: user.role_id,
              roleName: user.role?.name || "",
              locations: (user.locations || []).map((loc) => loc.name),
              locationIds: (user.locations || []).map((loc) => loc.location_id),
            }))
            : []
        );
        setLoading(false);
      } catch (err) {
        setError(err.message || "Unknown error");
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // menja rolu usera lokalno
  const updateUserRole = (userId, roleId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, roleId, roleName: getRoleById(roleId)?.name || "" }
          : user
      )
    );
  };

  // menja lokacije usera lokalno
  const toggleLocation = (userId, locationName) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        const hasLocation = user.locations.includes(locationName);
        let newLocations, newLocationIds;
        const locObj = locations.find((l) => l.name === locationName);
        if (!locObj) return user;

        if (hasLocation) {
          newLocations = user.locations.filter((loc) => loc !== locationName);
          newLocationIds = user.locationIds.filter(
            (id) => id !== locObj.location_id
          );
        } else {
          newLocations = [...user.locations, locationName];
          newLocationIds = [...user.locationIds, locObj.location_id];
        }
        return { ...user, locations: newLocations, locationIds: newLocationIds };
      })
    );
  };

  // cuva izmene
  const saveUser = async (user) => {
    setSavingUserId(user.id);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");

      // update role
      const roleResponse = await fetch(
        `http://localhost:8000/users/${user.id}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role_id: user.roleId }),
        }
      );
      if (!roleResponse.ok) throw new Error("Failed to update role");

      // update locations
      const locationsResponse = await fetch(
        `http://localhost:8000/users/${user.id}/locations`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ location_ids: user.locationIds }),
        }
      );
      if (!locationsResponse.ok) throw new Error("Failed to update locations");

      alert(`User ${user.name} saved successfully`);
    } catch (err) {
      setError(err.message || "Failed to save user");
    } finally {
      setSavingUserId(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <style>{`
        table {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
          max-width: 1000px;
          margin: 20px auto;
          font-family: Arial, sans-serif;
          border: 1px solid #ccc;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 8px rgba(0,0,0,0.1);
        }
        thead tr {
          background-color: #a31d1d;
          color: white;
        }
        th, td {
          border-bottom: 1px solid #ccc;
          padding: 8px 12px;
          text-align: left;
          vertical-align: top;
        }
        thead th:first-child {
          border-top-left-radius: 10px;
        }
        thead th:last-child {
          border-top-right-radius: 10px;
        }
        tbody tr:last-child td:first-child {
          border-bottom-left-radius: 10px;
        }
        tbody tr:last-child td:last-child {
          border-bottom-right-radius: 10px;
        }
        select {
          padding: 4px 8px;
          font-size: 14px;
        }
        .locations-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          max-width: 300px;
        }
        .location-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          user-select: none;
        }
        button.save {
          background-color: #A31D1D;
          border: none;
          padding: 6px 12px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 14px;
          color: white;
          transition: background-color 0.3s ease;
        }
        button.save:hover:not(:disabled) {
          background-color: #d74c4cff;
        }
        button.save:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>

      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th> {/* New column */}
            <th>Role</th>
            <th>Locations</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => {
            const isElevatedRole =
              user.roleName?.toLowerCase() === "admin" ||
              user.roleName?.toLowerCase() === "owner";

            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.roleId}
                    onChange={(e) =>
                      updateUserRole(user.id, Number(e.target.value))
                    }
                    disabled={savingUserId === user.id}
                  >
                    {roles?.map((role) => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="locations-list">
                    {locations?.map((loc) => (
                      <label
                        className="location-item"
                        key={loc.location_id}
                        style={{
                          color: isElevatedRole ? "#aaa" : "initial",
                          cursor: isElevatedRole ? "not-allowed" : "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          disabled={isElevatedRole || savingUserId === user.id}
                          checked={user.locations.includes(loc.name)}
                          onChange={() => toggleLocation(user.id, loc.name)}
                        />
                        {loc.name}
                      </label>
                    ))}
                  </div>
                </td>
                <td>
                  <button
                    className="save"
                    disabled={savingUserId === user.id}
                    onClick={() => saveUser(user)}
                  >
                    {savingUserId === user.id ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
