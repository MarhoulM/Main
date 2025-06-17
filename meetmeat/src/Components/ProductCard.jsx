import "./ProductCard.css";
import { useCart } from "./CartContext";
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ products }) => {
  const { addToCart } = useCart();

  if (!products || products.length === 0) {
    return (
      <div className="no-products-found">
        <h2>Žádné produkty nebyly nalezeny.</h2>
        <p>Zkuste něco jiného.</p>
      </div>
    );
  }
  return (
    <>
      <div className="product-card-container">
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-content">
              <Link to={`/products/${item.id}`}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="product-image"
                />
                <h2 className="product-name">{item.name}</h2>
                <p className="product-description">{item.description}</p>
              </Link>
            </div>
            <div className="product-footer">
              <div className="product-price">
                {item.price} {item.currency}
              </div>
              <button
                className="add-to-cart-btn"
                onClick={() => {
                  addToCart(item);
                }}
              >
                Přidat do košíku
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductCard;
