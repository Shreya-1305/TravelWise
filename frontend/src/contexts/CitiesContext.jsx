import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const BASE_URL = "http://localhost:5000/api/v1";
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, token, isAuthenticated } = useAuth();

  const getAuthHeaders = () => {
    if (!token) return {};
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ✅ Fetch cities when user logs in or signs up
  useEffect(() => {
    async function fetchCities() {
      if (!isAuthenticated || !token) {
        setCities([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/cities`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load cities");

        setCities(data.data.cities);
      } catch (err) {
        setError(err.message || "Error loading cities.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, [isAuthenticated, token]); // 🟢 depends on login/logout

  const getCity = useCallback(
    async (id) => {
      if (!id || !token) return;
      if (String(currentCity?._id) === String(id)) return;

      setIsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setCurrentCity(data.data.city);
      } catch (err) {
        setError(err.message || "Error fetching city.");
      } finally {
        setIsLoading(false);
      }
    },
    [currentCity, token]
  );

  async function createCity(newCity) {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newCity),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCities((prev) => [...prev, data.data.city]);
      setCurrentCity(data.data.city);
    } catch (err) {
      setError(err.message || "Error creating city.");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete city");

      setCities((prev) => prev.filter((city) => city._id !== id));
      setCurrentCity(null);
    } catch (err) {
      setError(err.message || "Error deleting city.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        currentCity,
        isLoading,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("useCities must be used within CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
