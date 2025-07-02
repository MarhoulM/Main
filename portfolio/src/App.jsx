import { useState, useRef, useEffect } from "react";
import Portfolio from "./Components/Portfolio";
import ProjectDetail from "./Components/ProjectDetail";
import { projects } from "./Data/projectsData";
import About from "./Components/About";
import ContactForm from "./Components/ContactForm";
import Source from "./Components/Source";
import Certs from "./Components/Certs";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import AboutNavbar from "./Components/AboutNavbar";

import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState("portfolio");
  const [hoveredPath, setHoveredPath] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const handleHoverChange = (path) => {
    setHoveredPath(path);
  };

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const profilRef = useRef(null);
  const jobExperienceRef = useRef(null);
  const educationRef = useRef(null);
  const otherRef = useRef(null);

  const sectionRefs = {
    "profil-section": profilRef,
    "job-experience-section": jobExperienceRef,
    "education-section": educationRef,
    "other-section": otherRef,
  };

  const location = useLocation();
  const isAboutPage = location.pathname === "/about";

  useEffect(() => {
    document.body.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <>
      <Header hoveredPath={hoveredPath} />
      <nav className="navbar-wrapper">
        <Navbar
          onHoverChange={handleHoverChange}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        {isAboutPage && <AboutNavbar sectionRef={sectionRefs} />}
      </nav>
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <div className="content-wrapper portfolio-wrapper">
                <Portfolio />
              </div>
            }
          />
          <Route
            path="/portfolio"
            element={
              <div className="content-wrapper portfolio-wrapper">
                <Portfolio />
              </div>
            }
          />
          <Route
            path="/portfolio/:projectId"
            element={
              <div className="content-wrapper project-detail-wrapper">
                <ProjectDetail allProjects={projects} />
              </div>
            }
          />
          <Route
            path="/about"
            element={
              <div className="content-wrapper about-wrapper">
                <About
                  profilRef={profilRef}
                  jobExperienceRef={jobExperienceRef}
                  educationRef={educationRef}
                  otherRef={otherRef}
                />
              </div>
            }
          />
          <Route
            path="/contact"
            element={
              <div className="content-wrapper contact-wrapper">
                <ContactForm />
              </div>
            }
          />
          <Route
            path="/certs"
            element={
              <div className="content-wrapper certs-wrapper">
                <Certs />
              </div>
            }
          />
          <Route
            path="/sources"
            element={
              <div className="content-wrapper source-wrapper">
                <Source />
              </div>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
