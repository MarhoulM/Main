import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Navbar.css";
import "./About.css";

const AboutNavbar = ({ sectionRef }) => {
  const [activeSection, setActiveSection] = useState("profil-section");

  const scrollToId = useCallback((id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observerCallback = (entries) => {
      let mostVisible = null;
      let maxRatio = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisible = entry.target.id;
        }
      });
      if (mostVisible) {
        setActiveSection(mostVisible);
      }
    };

    const observer = new window.IntersectionObserver(
      observerCallback,
      observerOptions
    );

    Object.values(sectionRef).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionRef]);

  return (
    <>
      <nav className="about-navbar">
        <div className="navbar-links">
          <button
            className={`navbar-btn ${
              activeSection === "profil-section" ? "active" : ""
            }`}
            onClick={() => scrollToId("profil-section")}
          >
            Profil
          </button>
          <button
            className={`navbar-btn ${
              activeSection === "job-experience-section" ? "active" : ""
            }`}
            onClick={() => scrollToId("job-experience-section")}
          >
            Pracovní zkušenosti
          </button>
          <button
            className={`navbar-btn ${
              activeSection === "education-section" ? "active" : ""
            }`}
            onClick={() => scrollToId("education-section")}
          >
            Vzdělání
          </button>
          <button
            className={`navbar-btn ${
              activeSection === "other-section" ? "active" : ""
            }`}
            onClick={() => scrollToId("other-section")}
          >
            Ostatní
          </button>
        </div>
      </nav>
    </>
  );
};

export default AboutNavbar;
