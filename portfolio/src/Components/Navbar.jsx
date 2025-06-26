import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const PortfolioClick = () => {
    navigate("/portfolio");
  };

  const AboutClick = () => {
    navigate("/about");
  };

  const ContactClick = () => {
    navigate("/contact");
  };

  const DownaloadClick = () => {
    navigate("/downloads");
  };

  const isActive = (path) => {
    if (path == "/" && location.pathname === "/portfolio") {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <button
          className={`navbar-btn ${
            isActive("/") || isActive("/portfolio") ? "active" : ""
          }`}
          onClick={() => {
            PortfolioClick();
          }}
        >
          Portfolio
        </button>
        <button
          className={`navbar-btn ${isActive("/about") ? "active" : ""}`}
          onClick={() => {
            AboutClick();
          }}
        >
          O mě
        </button>
        <button
          className={`navbar-btn ${isActive("/contact") ? "active" : ""}`}
          onClick={() => {
            ContactClick();
          }}
        >
          Kontakt
        </button>
        <button
          className={`navbar-btn ${isActive("/downloads") ? "active" : ""}`}
          onClick={() => {
            DownaloadClick();
          }}
        >
          Ke stažení
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
