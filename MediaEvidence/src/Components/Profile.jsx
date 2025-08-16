import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import "./Profile.css";
import PreviousBtn from "./PreviousBtn";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <div className="profile-container">
        <h1>Ahoj, {user?.username || user?.email || "uživateli"}.</h1>
        <p>E-mail: {user.email}</p>
        <button className="button" onClick={logout}>
          Odhlásit
        </button>
        <PreviousBtn />
      </div>
    );
  }

  return (
    <>
      <div className="auth-container">
        <h1>Media Evidence</h1>
        {isRegistering ? (
          <>
            <Register />
            <p>
              Již máte účet?{" "}
              <button
                className="sign-button"
                onClick={() => setIsRegistering(false)}
              >
                Přihlásit
              </button>
            </p>
          </>
        ) : (
          <>
            <Login />
            <p>
              Ještě nemáte účet?{" "}
              <button
                className="register-button"
                onClick={() => setIsRegistering(true)}
              >
                Registrovat
              </button>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
