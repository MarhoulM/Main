import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";

const AboutNavbar = ({ sectionRef }) => {
  const [activeSection, setActiveSection] = useState("profil-section");
  const observer = useRef(null);

  const scrollToId = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const header = document.querySelector(".header");
    let headerHeight = 0;
    if (header) {
      headerHeight = header.offsetHeight;
    }

    const options = {
      root: null,
      rootMargin: `-${headerHeight + 20}px 0px -50% 0px`,
      threshold: 0,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const rect = entry.target.getBoundingClientRect();
          if (
            rect.top <= headerHeight + 50 &&
            rect.bottom > headerHeight + 50
          ) {
            setActiveSection(entry.target.id);
          }
        }
      });
    };

    observer.current = new IntersectionObserver(callback, options);

    Object.values(sectionRef).forEach((ref) => {
      if (ref.current) {
        observer.current.observe(ref.current);
      }
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
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
              activeSection === "edu-section" ? "active" : ""
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
