import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import "./Profile.css";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleMyOrdersClick = () => {
    navigate("/my-orders");
  };

  if (isAuthenticated) {
    return (
      <div className="profile-container">
        <h1>Ahoj, {user?.username || user?.email || "uživateli"}.</h1>
        <p>E-mail: {user.email}</p>
        <button onClick={handleMyOrdersClick} className="btn-primary spacer">
          Moje objednávky
        </button>
        <button className="btn-primary" onClick={logout}>
          Odhlásit
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="auth-container">
        <h1>Meet Meat</h1>
        {isRegistering ? (
          <>
            <Register />
            <p>
              Již máte účet?{" "}
              <button className="btn" onClick={() => setIsRegistering(false)}>
                Přihlásit
              </button>
            </p>
          </>
        ) : (
          <>
            <Login />
            <p>
              Ještě nemáte účet?{" "}
              <button className="btn" onClick={() => setIsRegistering(true)}>
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
