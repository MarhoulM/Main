import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});
    setApiResult(null);

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Hesla se neshodují.",
      }));
      return;
    }
    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Heslo musí mít alespoň 6 znaků.",
      }));
      return;
    }

    setLoading(true);

    try {
      const result = await register(username, email, password);
      setApiResult(result);

      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        setMessage(result.message || "Registrace se nezdařila.");
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      console.error("Došlo k chybě během registrace:", error);
      setMessage("Došlo k neočekávané chybě během registrace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      {" "}
      <h2>Registrace</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {" "}
        <div className="form-group">
          <label htmlFor="reg-username">Uživatelské jméno:</label>
          <input
            type="text"
            id="reg-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Zadejte uživatelské jméno"
            required
            className={errors.username ? "input-error" : ""}
          />
          {errors.username && <p className="error-text">{errors.username}</p>}{" "}
        </div>
        <div className="form-group">
          <label htmlFor="reg-email">E-mail:</label>
          <input
            type="email"
            id="reg-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Zadejte email"
            required
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="reg-password">Heslo:</label>
          <input
            type="password"
            id="reg-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Zadejte heslo"
            required
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        <div className="form-group">
          {" "}
          <label htmlFor="reg-confirmPassword">Potvrdit heslo:</label>
          <input
            type="password"
            id="reg-confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Potvrďte heslo"
            required
            className={errors.confirmPassword ? "input-error" : ""}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}
        </div>
        <button type="submit" disabled={loading} className="register-button">
          {" "}
          {loading ? "Registruji se..." : "Registrovat"}
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
export default Register;
