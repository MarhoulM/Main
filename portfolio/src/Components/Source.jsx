import React from "react";
import { projects } from "../Data/projectsData";
const Source = () => {
  return (
    <div className="source-container">
      <h2>Ke stažení:</h2>
      <div className="cv-container">
        <a href="soubor-location" /*source="/...."*/>
          <h2>CV - Ing. Michal Marhoul</h2>
        </a>
      </div>
      <h2>Zdroje na GitHub:</h2>
      {projects.map((project) => (
        <div key={project.id} className="source">
          <h3 className="project-name">{project.name}</h3>
          <div className="category">
            {project.category.map((cat) => (
              <p key={cat.css} className={`${cat.css}`}>
                {cat.display}
              </p>
            ))}
          </div>
          <p className="source">
            Zdroj:{" "}
            <a href="soubor-location" source={project.source}>
              {project.source}
            </a>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Source;
