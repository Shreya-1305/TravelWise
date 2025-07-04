import { createContext, useContext, useState, useEffect } from "react";
import SpinnerFullPage from "../components/SpinnerFullPage";

const AuthContext = createContext();

const BASE_URL = "http://localhost:5000/api/v1";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Check token on mount
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (!localToken) {
      setIsAuthLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`${BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        setUser(data.data.user);
        setIsAuthenticated(true);
        setAuthError("");
        setToken(localToken);
      } catch (err) {
        logout();
        console.error("Session expired or invalid token");
      } finally {
        setIsAuthLoading(false);
      }
    }

    fetchUser();
  }, []);

  async function login(email, password) {
    try {
      localStorage.removeItem("token");
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      setUser(data.data.user);
      setIsAuthenticated(true);
      setToken(data.token);
      setAuthError("");
    } catch (err) {
      setAuthError(err.message);
    }
  }

  async function signup(name, email, password, passwordConfirm) {
    try {
      localStorage.removeItem("token");
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, passwordConfirm }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      localStorage.setItem("token", data.token);
      setUser(data.data.user);
      setIsAuthenticated(true);
      setToken(data.token);
      setAuthError("");
    } catch (err) {
      setAuthError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setAuthError("");
    setToken(null);
  }

  if (isAuthLoading) return <SpinnerFullPage />;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        login,
        logout,
        signup,
        authError,
        token, // 🟢 available for other providers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
