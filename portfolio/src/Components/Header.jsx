import React from "react";
import Info from "./Info";
import Navbar from "./Navbar";
import DynamicImg from "./DynamicImg";
import "./Header.css";

const Header = ({ navbarRef }) => {
  return (
    <>
      <header className="header">
        <div className="header-inner-container">
          <div className="header-top-section">
            <div className="dynamic-img-wrapper">
              <DynamicImg />
              <div className="dynamic-img-placeholder-circle"></div>
            </div>
            <div className="info-container">
              <Info />
            </div>
          </div>
          <div className="navbar-wrapper" ref={navbarRef}>
            <Navbar />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
