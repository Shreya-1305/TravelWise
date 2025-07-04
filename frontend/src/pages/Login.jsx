import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/AuthContext"; // ✅ use real AuthContext
import styles from "./Login.module.css";
import { useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { login, isAuthenticated, authError } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    console.log("login");
    try {
      await login(email, password);
    } catch (err) {
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="raj@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        {authError && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{authError}</p>
        )}
        {loginError && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{loginError}</p>
        )}

        <div>
          <Button type="primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </main>
  );
}
