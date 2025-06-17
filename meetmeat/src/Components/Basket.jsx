import React from "react";
import { useCart } from "./CartContext";
import "./Basket.css";
import { useNavigate } from "react-router-dom";

const Basket = () => {
  const { cartItems, removeFromCart, getTotalItems, updateQuantity } =
    useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="basket-container">
      {" "}
      {cartItems.length === 0 ? (
        <div className="empty-basket">
          <h2>Váš košík je prázdný!</h2>
          <p>Prohlédněte si naši nabídku a přidejte si něco dobrého.</p>
          <button className="btn" onClick={() => navigate("/products")}>
            Zpět na produkty
          </button>
        </div>
      ) : (
        <>
          <div className="basket-product-list">
            <h2>Váš košík:</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="basket-item">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="basket-item-image"
                />
                <div className="basket-item-detail">
                  <h3>{item.name}</h3>
                  <p>
                    Cena za kus: {item.price}
                    {item.currency}
                  </p>
                  <div className="basket-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-item">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p>
                    Celkem: {item.price * item.quantity} {item.currency}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-item-btn"
                  >
                    Odebrat
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="basket-summary">
            <h3>Celkem položek: {getTotalItems()}</h3>
            <h3>Celková cena: {totalPrice} Kč</h3>
            <button className="confirm-order-btn" onClick={handleCheckout}>
              Přejít k dopravě a platbě
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Basket;
