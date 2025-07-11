import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../Data/projectsData";
import ImgCarousel from "./ImgCarousel";
import "./ProjectDetail.css";

const ProjectDetail = ({ allProjects, theme }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = allProjects.find((p) => p.id === parseInt(projectId));
  const imagesCarousel = project.img;

  return (
    <>
      <div className="project-detail-container">
        <ImgCarousel theme={theme} images={imagesCarousel} />
        <h2 className="project-name">{project.name}</h2>
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
        <div className="project-links-wrapper">
          {project.deploy && project.deploy.length > 0 ? (
            <>
              <p className="deploy-label">Nasazení:</p>
              {project.deploy.map((deployUrl, index) => (
                <a
                  key={index}
                  href={deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-item"
                >
                  {deployUrl}
                </a>
              ))}
            </>
          ) : null}
        </div>
        <p className="project-detailDescription">{project.detailDescription}</p>
        <button className="btn" onClick={() => navigate(-1)}>
          Zpět na portfolio
        </button>
      </div>
    </>
  );
};
export default ProjectDetail;
