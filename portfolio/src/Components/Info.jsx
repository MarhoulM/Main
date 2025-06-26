import React from "react";
import "./Header.css";

const Info = () => {
  return (
    <div className="info-container">
      <h1>Ing. Michal Marhoul</h1>
      <h3>
        Telefon: <a href="tel:+420723028376">+420 723 028 376</a>
      </h3>
      <h3>
        E-mail: <a href="mailto:Marhoul.M@seznam.cz">Marhoul.M@seznam.cz</a>
      </h3>
      <h3>
        LinkedIn:{" "}
        <a href="http://www.linkedin.com/in/michal-marhoul-223440132">
          http://www.linkedin.com/in/michal-marhoul-223440132
        </a>
      </h3>
      <h3>
        GitHub:{" "}
        <a href="https://github.com/MarhoulM/Main.git">
          https://github.com/MarhoulM/Main.git
        </a>
      </h3>
    </div>
  );
};

export default Info;
