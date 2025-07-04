import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Login.module.css"; // Reusing login styles

export default function Signup() {
  const [name, setName] = useState("Raj");
  const [email, setEmail] = useState("raj@example.com");
  const [password, setPassword] = useState("qwerty");
  const [passwordConfirm, setPasswordConfirm] = useState("qwerty");
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  const { signup, isAuthenticated, authError } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSignupError("");

    try {
      await signup(name, email, password, passwordConfirm);
    } catch (err) {
      setSignupError("Signup failed. Please try again.");
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
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
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

        <div className={styles.row}>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirm"
            onChange={(e) => setPasswordConfirm(e.target.value)}
            value={passwordConfirm}
          />
        </div>

        {authError && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{authError}</p>
        )}
        {signupError && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{signupError}</p>
        )}

        <div>
          <Button type="primary" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </Button>
        </div>
      </form>
    </main>
  );
}
