import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import profile from "../Svg/Profile.svg";
import food from "../Svg/FoodAdd.svg";
import meal from "../Svg/MealFoodAdd.svg";
import goal from "../Svg/UserGoal.svg";
import { useDate } from "./DateContext";

const ProfileIcon = () => {
  return <img src={profile} alt="Profil" />;
};
const FoodIcon = () => {
  return <img src={food} alt="Add Food" />;
};
const MealIcon = () => {
  return <img src={meal} alt="Add Meal" />;
};

const GoalIcon = () => {
  return <img src={goal} alt="Goal" />;
};

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectedDate, setSelectedDate } = useDate();

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${date}-${month}-${year}`;
  };
  return (
    <>
      <div className="navbar">
        <div className="left-zone">
          <div className="kalormap">
            <a
              href="#"
              onClick={() => {
                navigate("/");
              }}
            >
              Kalormap
            </a>
          </div>
        </div>
        <div className="middle-zone">
          <input type="date" value={selectedDate} onChange={handleDateChange} />
        </div>
        <div className="right-zone">
          <div className="profile">
            <a
              href="#"
              onClick={() => {
                navigate("/profile");
              }}
            >
              <ProfileIcon />
            </a>
          </div>
          {isAuthenticated ? (
            <>
              <div className="food">
                <a
                  href="#"
                  onClick={() => {
                    navigate("/food");
                  }}
                >
                  <FoodIcon />
                </a>
              </div>
              <div className="meal">
                <a
                  href="#"
                  onClick={() => {
                    navigate("/meal");
                  }}
                >
                  <MealIcon />
                </a>
              </div>
              <div className="goal">
                <a
                  href="#"
                  onClick={() => {
                    navigate("/goal");
                  }}
                >
                  <GoalIcon />
                </a>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
