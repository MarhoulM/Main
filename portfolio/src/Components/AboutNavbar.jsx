import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Navbar.css";
import "./About.css";

const AboutNavbar = ({ sectionRef }) => {
  const [activeSection, setActiveSection] = useState("profil-section");
  const scrollTimeout = useRef(null);

  const headerHeight = 92;

  const scrollToId = useCallback((id) => {
    const section = document.getElementById(id);
    if (section) {
      setActiveSection(id);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const getActiveSectionId = () => {
      let currentActive = "profil-section";
      let minDistanceFromTop = Infinity;

      Object.values(sectionRef).forEach((ref) => {
        if (ref.current) {
          const section = ref.current;
          const rect = section.getBoundingClientRect();
          const id = section.id;

          const sectionTopRelativeToViewport = rect.top;

          if (
            sectionTopRelativeToViewport <= headerHeight + 5 &&
            sectionTopRelativeToViewport > -section.offsetHeight
          ) {
            const distanceFromHeader = Math.abs(
              sectionTopRelativeToViewport - headerHeight
            );
            if (distanceFromHeader < minDistanceFromTop) {
              minDistanceFromTop = distanceFromHeader;
              currentActive = id;
            }
          }
        }
      });
      return currentActive;
    };

    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        const newActive = getActiveSectionId();
        if (newActive !== activeSection) {
          setActiveSection(newActive);
        }
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);

    const initialCheckTimeout = setTimeout(() => {
      setActiveSection(getActiveSectionId());
    }, 150);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      clearTimeout(initialCheckTimeout);
    };
  }, [sectionRef, activeSection, headerHeight]);

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
