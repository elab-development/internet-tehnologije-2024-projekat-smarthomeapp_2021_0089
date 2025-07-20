import { useEffect, useState, useCallback } from "react";

export function useDevices(token, deviceTypeFilter, locationFilter) {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = useCallback(() => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    let url = "http://localhost:8000/devices/";
    const params = new URLSearchParams();

    if (deviceTypeFilter) params.append("device_type", deviceTypeFilter);
    if (locationFilter) params.append("location_id", locationFilter);

    url += `?${params.toString()}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch devices");
        }
        return res.json();
      })
      .then(data => {
        setDevices(data?.data ?? []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load devices:", err);
        setError(err);
        setDevices([]);
        setIsLoading(false);
      });
  }, [deviceTypeFilter, locationFilter, token]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    setDevices,
    refetch: fetchDevices,
    isLoading,
    error
  };
}
