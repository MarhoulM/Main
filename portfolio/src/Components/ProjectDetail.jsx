import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../Data/projectsData";

const ProjectDetail = ({ allProjects }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = allProjects.find((p) => p.id === parseInt(projectId));

  return (
    <>
      <div className="project-detail-container">
        <img src={project.img} alt={project.name} className="project-iamge" />
        <h2 className="project-name">{project.name}</h2>
        <p className="project-description">{project.description}</p>
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
        <p className="project-detailDescription">{project.detailDescription}</p>
        <button className="btn" onClick={() => navigate(-1)}>
          Zpět na portfolio
        </button>
      </div>
    </>
  );
};
export default ProjectDetail;
