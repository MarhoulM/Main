import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./MyOrders.css";
import Loader from "./Loader";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDetailOrderClick = (orderId) => {
    console.log("handleDetailOrderClick spuštěn pro Order ID:", orderId);
    navigate(`/my-orders/${orderId}`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        if (!token) {
          setError("Pro zobrazení objednávek se musíte přihlásit.");
          setLoading(false);
          navigate("/login");
          return;
        }

        const response = await fetch(
          "https://localhost:7240/api/Order/my-orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else if (response.status === 401) {
          setError("Vaše relace vypršela. Přihlaste se prosím znovu.");
          navigate("/login");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Nepodařilo se načíst objednávky.");
        }
      } catch (err) {
        console.error("Chyba při načítání objednávek:", err);
        setError(
          "Došlo k chybě při načítání objednávek. Zkuste to prosím znovu."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="my-orders-container loading-container">
        <span>Načítání objednávek</span> <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="my-orders-container error-message">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="my-orders-container">
        <h2>Žádné objednávky nebyly nalezeny.</h2>
        <p>Až si něco objednáte, zobrazí se zde.</p>
        <button className="btn-primary" onClick={() => navigate("/products")}>
          Zpět na produkty
        </button>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <h2>Moje objednávky</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <h3>Objednávka #{order.id}</h3>
          <p>Datum: {new Date(order.orderDate).toLocaleDateString()}</p>
          <p>Celková cena: {order.totalAmount} Kč</p>
          <p>Status: {order.status}</p>
          <button
            onClick={() => handleDetailOrderClick(order.id)}
            className="btn-primary"
          >
            Zobrazit detail
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
