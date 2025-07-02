import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import sun from "../Images/sun.svg";
import moon from "../Images/moon.svg";

const Navbar = ({ onHoverChange, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const PortfolioClick = () => {
    navigate("/portfolio");
  };

  const AboutClick = () => {
    navigate("/about");
  };

  const ContactClick = () => {
    navigate("/contact");
  };

  const SourceClick = () => {
    navigate("/sources");
  };

  const CertsClick = () => {
    navigate("/certs");
  };

  const isActive = (path) => {
    if (path == "/" && location.pathname === "/portfolio") {
      return true;
    }
    return location.pathname === path;
  };

  const handleMouseEnter = (path) => {
    onHoverChange(path);
  };

  const handleMouseLeave = () => {
    onHoverChange(null);
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
          onMouseEnter={() => handleMouseEnter("/portfolio")}
          onMouseLeave={handleMouseLeave}
        >
          Portfolio
        </button>
        <button
          className={`navbar-btn ${isActive("/about") ? "active" : ""}`}
          onClick={() => {
            AboutClick();
          }}
          onMouseEnter={() => handleMouseEnter("/about")}
          onMouseLeave={handleMouseLeave}
        >
          O mě
        </button>
        <button
          className={`navbar-btn ${isActive("/contact") ? "active" : ""}`}
          onClick={() => {
            ContactClick();
          }}
          onMouseEnter={() => handleMouseEnter("/contact")}
          onMouseLeave={handleMouseLeave}
        >
          Kontakt
        </button>
        <button
          className={`navbar-btn ${isActive("/certs") ? "active" : ""}`}
          onClick={() => {
            CertsClick();
          }}
          onMouseEnter={() => handleMouseEnter("/certs")}
          onMouseLeave={handleMouseLeave}
        >
          Certifikáty
        </button>
        <button
          className={`navbar-btn ${isActive("/sources") ? "active" : ""}`}
          onClick={() => {
            SourceClick();
          }}
          onMouseEnter={() => handleMouseEnter("/sources")}
          onMouseLeave={handleMouseLeave}
        >
          Zdroje
        </button>
        <button
          className="navbar-btn theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Přepnout světlý/tmavý režim"
        >
          {theme === "light" ? (
            <img className="theme-icon" src={moon} alt="Moon icon" />
          ) : (
            <img className="theme-icon" src={sun} alt="Sun icon" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
