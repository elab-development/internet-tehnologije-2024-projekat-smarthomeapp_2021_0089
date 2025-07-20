import { useEffect, useState } from "react";

export function useLocations(token) {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      if (!token) return;

      try {
        const userRes = await fetch("http://localhost:8000/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!userRes.ok) throw new Error("Failed to fetch user");

        const userData = await userRes.json();

        const locRes = await fetch(`http://localhost:8000/users/${userData.user_id}/locations`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!locRes.ok) throw new Error("Failed to fetch locations");

        const locData = await locRes.json();
        setLocations(locData);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      }
    };

    fetchLocations();
  }, [token]);

  return { locations, error };
}
