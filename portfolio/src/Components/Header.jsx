import React from "react";
import { useLocation } from "react-router-dom";
import Info from "./Info";
import DynamicImg from "./DynamicImg";
import "./Header.css";

const Header = ({ hoveredPath }) => {
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";
  return (
    <>
      <header className={`header ${isAboutPage ? "header--about" : ""}`}>
        <div className="header-inner-container">
          <div className="header-top-section">
            <div
              className={`dynamic-img-wrapper ${
                isAboutPage ? "dynamic-img-wrapper--about" : ""
              }`}
            >
              <DynamicImg isAboutPage={isAboutPage} hoveredPath={hoveredPath} />
              <div className="dynamic-img-placeholder-circle"></div>
            </div>
            {!isAboutPage && (
              <div className="info-container">
                <Info />
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
