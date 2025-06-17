import React, { createContext, useState, useContext } from "react";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => (total += item.quantity), 0);
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };
  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    getTotalItems,
    updateQuantity,
    getTotalPrice,
    clearCart,
  };
  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
export const useCart = () => {
  return useContext(CartContext);
};
