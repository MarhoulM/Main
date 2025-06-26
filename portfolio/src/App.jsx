import { useState, useRef, useEffect } from "react";
import Portfolio from "./Components/Portfolio";
import ProjectDetail from "./Components/ProjectDetail";
import { projects } from "./Data/projectsData";
import About from "./Components/About";
import ContactForm from "./Components/ContactForm";
import Download from "./Components/Download";
import Header from "./Components/Header";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Header />
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
                  <About />
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
              path="/downloads"
              element={
                <div className="content-wrapper download-wrapper">
                  <Download />
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
