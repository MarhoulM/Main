import React from "react";
import { useCart } from "./CartContext";
import "./ProductDetail.css";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetail = ({ allProducts }) => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = allProducts.find((p) => p.id === parseInt(productId));

  if (!product) {
    return (
      <>
        <div className="product-detail-container">
          <h2>Produkt nenalezen.</h2>
          <button onClick={() => navigate("/products")}>
            Zpět na produkty
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="product-detail-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-detail-image"
        />
        <h1>{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <p className="product-detail-category">Kategorie: {product.category}</p>
        <p className="product-detail-price">
          {product.price} {product.currency}
        </p>
        <button className="btn" onClick={() => addToCart(product)}>
          Přidat do košíku
        </button>
        <div className="product-detail-description">
          <h3>Detailní informace:</h3>
          <p>
            <strong>Typ masa:</strong> {product.detailDescription.meatType}
          </p>
          <p>
            <strong>Proces výroby:</strong> {product.detailDescription.process}
          </p>
          <p>
            <strong>Hmotnost:</strong> {product.detailDescription.weight}
          </p>
          {product.detailDescription.nutrition && (
            <p>
              <strong>Výživové informace:</strong>{" "}
              {product.detailDescription.nutrition}
            </p>
          )}
          {product.detailDescription.origin && (
            <p>
              <strong>Původ:</strong> {product.detailDescription.origin}
            </p>
          )}
          {product.detailDescription.shelfLife && (
            <p>
              <strong>Spotřebujte do:</strong>{" "}
              {product.detailDescription.shelfLife}
            </p>
          )}
        </div>
        <button className="btn" onClick={() => navigate(-1)}>
          Zpět na produkty
        </button>
      </div>
    </>
  );
};

export default ProductDetail;
