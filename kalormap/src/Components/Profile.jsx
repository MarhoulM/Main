import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import "./Profile.css";
import PreviousBtn from "./PreviousBtn";
import UserData from "./UserData";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleFoodClick = () => {
    navigate("/food");
  };
  const handleMealClick = () => {
    navigate("/meal");
  };
  const handleGoalClick = () => {
    navigate("/goal");
  };

  if (isAuthenticated) {
    return (
      <div className="profile-container">
        <h1>Ahoj, {user?.username || user?.email || "uživateli"}.</h1>
        <p>E-mail: {user.email}</p>
        <UserData />
        <button onClick={handleFoodClick} className="button">
          Přidat potravinu
        </button>
        <button onClick={handleMealClick} className="button">
          Přidat jídlo
        </button>
        <button onClick={handleGoalClick} className="button">
          Cíle
        </button>
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
        <h1>Kalormap</h1>
        {isRegistering ? (
          <>
            <Register />
            <p>
              Již máte účet?{" "}
              <button
                className="button"
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
              <button className="button" onClick={() => setIsRegistering(true)}>
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
