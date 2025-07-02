import React from "react";
import { Link } from "react-router-dom";
import { projects } from "../Data/projectsData";
import "./Portfolio.css";

const Portfolio = () => {
  return (
    <div className="portfolio-container">
      {projects.map((project) => (
        <div key={project.id} className="project-card">
          <Link to={`/portfolio/${project.id}`}>
            <img
              src={project.img[0]}
              alt={project.name}
              className="project-image"
            />
            <h2 className="project-name">{project.name}</h2>
            <p className="project-description">{project.description}</p>
            <div className="category">
              {project.category.map((cat) => (
                <p key={cat.css} className={`${cat.css}`}>
                  {cat.display}
                </p>
              ))}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Portfolio;
