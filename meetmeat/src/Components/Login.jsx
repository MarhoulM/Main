import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});
    setApiResult(null);
    setLoading(true);

    try {
      const result = await login(username, password);
      setApiResult(result);

      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else {
        setMessage(result.message || "Přihlášení se nezdařilo.");
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      console.error("Došlo k chybě během přihlášení:", error);
      setMessage("Došlo k neočekávané chybě během přihlášení.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Přihlášení</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="login-username">Uživatelské jméno:</label>
          <input
            type="text"
            id="login-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Zadejte Vaše uživatelské jméno."
            required
            className={errors.username ? "input-error" : ""}
          />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Heslo:</label>
          <input
            id="login-password"
            type="password"
            placeholder="Zadejte své heslo."
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Přihlašuji se..." : "Přihlásit se"}
        </button>

        {message && (
          <p
            className={`form-message ${
              apiResult?.success ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
