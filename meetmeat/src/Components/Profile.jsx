import { useState } from "react";
import { useAuth } from "./AuthContext";
import Login from "./Login";
import Register from "./Register";
import "./Profile.css";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (isAuthenticated) {
    return (
      <div className="profile-container">
        <h1>Ahoj, {user?.username || user?.email || "uživateli"}.</h1>
        <p>E-mail: {user.email}</p>
        <button className="logout-btn" onClick={logout}>
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
              <button
                className="link-btn"
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
                className="link-btn"
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
