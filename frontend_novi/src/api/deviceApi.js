export const updateDevice = async (deviceId, updates) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`http://localhost:8000/devices/${deviceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Device update failed");
  }

  return await response.json();
};
