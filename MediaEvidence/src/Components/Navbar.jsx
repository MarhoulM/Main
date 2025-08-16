import React from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import profile from "../Svg/Profile.svg";
import db from "../Svg/Db.svg";

const ProfileIcon = () => {
  return <img src={profile} alt="Profil" />;
};

const SettingsIcon = () => {
  return <img src={db} alt="Settings" />;
};

const Navbar = ({ onSearch, searchTerm, onSearchSubmit, onClearSearch }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const handleSearchBtnClick = () => {
    onSearchSubmit(searchTerm);
    navigate("/");
  };

  const handleHomeClick = () => {
    onClearSearch();
    navigate("/");
  };

  return (
    <>
      <div className="navbar">
        <div className="left-zone">
          <div className="evidence">
            <a
              href="#"
              onClick={() => {
                navigate("/");
              }}
            >
              Media Evidence
            </a>
          </div>
        </div>
        <div className="middle-zone">
          <input
            className="search-input"
            type="text"
            placeholder="Zadejte hledaný výraz."
            value={searchTerm}
            onChange={handleSearchChange}
            id="searchInput"
            name="searchTerm"
          />
          <button className="search-btn" onClick={handleSearchBtnClick}>
            Hledat
          </button>
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
            <div className="settings">
              {" "}
              <a
                href="#"
                onClick={() => {
                  navigate("/settings");
                }}
              >
                <SettingsIcon />
              </a>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
