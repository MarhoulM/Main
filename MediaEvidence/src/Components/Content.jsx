import { useState } from "react";
import "./Content.css";

const Content = ({ products }) => {
  const isBookType = (category) => {
    return category !== "CD" && category !== "DVD";
  };

  if (!products || products.length === 0) {
    return (
      <div className="not-found">
        <h2>Žádné produkty nebyly nalezeny.</h2>
        <p>Zkuste něco jiného.</p>
      </div>
    );
  }
  return (
    <>
      <div className="product-container">
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-content">
              <h2 className="name">{item.name}</h2>{" "}
              <div className="id">ID: {item.id}</div>
              {isBookType(item.category) ? (
                <span className="author">Autor: {item.author}</span>
              ) : (
                <span className="director">Režisér: {item.director}</span>
              )}
              <div className="groups">
                <span className="category">{item.category}</span>
                <span className="genre"> {item.genre}</span>
                <span className="description"> - {item.description}</span>
                <div className="doa">
                  Přidáno dne:{" "}
                  {new Date(item.dateOfAcquisition).toLocaleDateString()}
                </div>
                <span className={item.availability ? "available" : "borrowed"}>
                  {item.availability
                    ? "Dostupné"
                    : `Zapůjčeno: ${item.borrowed}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Content;
