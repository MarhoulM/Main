import React from "react";
import { projects } from "../Data/projectsData";
const Download = () => {
  return (
    <div className="download-container">
      {projects.map((project) => (
        <div key={project.id} className="download">
          <p className="project-name">{project.name}</p>
          <div className="category">
            {project.category.map((cat) => (
              <p key={cat.css} className={`${cat.css}`}>
                {cat.display}
              </p>
            ))}
          </div>
          <p className="download">
            Stáhnout:{" "}
            <a href="soubor-location" download={project.download}>
              {project.download}
            </a>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Download;
