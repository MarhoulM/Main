import React from "react";
import { projects } from "../Data/projectsData";
import cvPdf from "../Data/CV_Michal_Marhoul.pdf";
import "./Source.css";

const Source = () => {
  return (
    <div className="source-container">
      <h2>Ke stažení:</h2>
      <div className="cv-container">
        <a href={cvPdf} download="CV_Michal_Marhoul.pdf">
          <h2>CV - Ing. Michal Marhoul</h2>
        </a>
      </div>
      <h2>Zdroje na GitHub:</h2>
      {projects.map((project) => (
        <div key={project.id} className="source">
          <h3 className="project-name">{project.name}</h3>
          <p className="project-description">{project.description}</p>
          <div className="category">
            {project.category.map((cat) => (
              <p key={cat.css} className={`${cat.css}`}>
                {cat.display}
              </p>
            ))}
          </div>
          <p className="source-label">Zdroj:</p>
          <div className="project-links-wrapper">
            {project.source &&
              project.source.split("\n").map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-item"
                >
                  {project.name === "Portfolio"
                    ? `Odkaz na GitHub (Část ${index + 1})   `
                    : "Odkaz na GitHub"}
                </a>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Source;
