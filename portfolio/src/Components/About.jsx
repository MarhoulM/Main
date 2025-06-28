import React, { useEffect } from "react";
import { cvData } from "../Data/cvData";
import "./About.css";

const About = ({ profilRef, jobExperienceRef, educationRef, otherRef }) => {
  return (
    <div className="about-container">
      <div className="about-content">
        {" "}
        <section id="profil-section" ref={profilRef}>
          {" "}
          <h1>{cvData.name}</h1>
          <div className="contact-list">
            {" "}
            <h3>
              Telefon: <a href="tel:+420723028376">+420 723 028 376</a>
            </h3>
            <h3>
              E-mail:{" "}
              <a href="mailto:Marhoul.M@seznam.cz">Marhoul.M@seznam.cz</a>
            </h3>
            <h3>
              LinkedIn:{" "}
              <a
                href="http://www.linkedin.com/in/michal-marhoul-223440132"
                target="_blank"
                rel="noopener noreferrer"
              >
                http://www.linkedin.com/in/michal-marhoul-223440132
              </a>
            </h3>
            <h3>
              GitHub:{" "}
              <a
                href="https://github.com/MarhoulM/Main.git"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/MarhoulM/Main.git
              </a>
            </h3>
          </div>
          <p className="profile-text">Profil: {cvData.profil}</p>{" "}
        </section>
        <section id="job-experience-section" ref={jobExperienceRef}>
          {" "}
          <h2>Pracovní zkušenosti:</h2>
          {cvData.jobExperience.map((jobxp, index) => (
            <div key={index} className="job-xp-item">
              <h3>{jobxp.position}</h3> <h4>{jobxp.company}</h4>
              <p>{jobxp.duration}</p>
              <ul>
                {jobxp.jobDescription.map((description, descIndex) => (
                  <li key={descIndex} className="job-desc-item">
                    {description}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section id="education-section" ref={educationRef}>
          {" "}
          <h2>Vzdělání: </h2>
          {cvData.education.map((info, index) => (
            <div key={index} className="edu-info">
              <h3>{info.program}</h3>
              <h4>{info.school}</h4>
              <p>{info.duration}</p>
            </div>
          ))}
        </section>
        <section id="other-section" ref={otherRef}>
          {" "}
          <h3>Technické dovednosti:</h3>
          <ul className="skills-list">
            {" "}
            {cvData.tehSkills.map((tskill, index) => (
              <li key={index} className="tech-skill-item">
                {tskill}
              </li>
            ))}
          </ul>
          <h3>Nástroje:</h3>
          <ul className="tools-list">
            {" "}
            {cvData.tools.map((tool, index) => (
              <li key={index} className="tool-item">
                {tool}
              </li>
            ))}
          </ul>
          <h3>Měkké dovednosti:</h3>
          <ul className="soft-skills-list">
            {" "}
            {cvData.softSkills.map((softskill, index) => (
              <li key={index} className="soft-skill-item">
                {softskill}
              </li>
            ))}
          </ul>
          <h3>Jazyky:</h3>
          <ul className="languages-list">
            {" "}
            {cvData.languages.map((lang, index) => (
              <li key={index} className="lang-item">
                {lang}
              </li>
            ))}
          </ul>
          <h3>Zájmy:</h3>
          <ul className="interests-list">
            {" "}
            {cvData.interests.map((interest, index) => (
              <li key={index} className="interest-item">
                {interest}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
