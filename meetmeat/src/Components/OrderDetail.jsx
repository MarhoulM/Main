import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetail.css";
import Loader from "./Loader";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("OrderDetail: Komponenta se vykresluje pro Order ID:", orderId);

  useEffect(() => {
    console.log(
      "OrderDetail useEffect: Spouštím načítání pro Order ID:",
      orderId
    );
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const userStringFromLocalStorage = localStorage.getItem("user");
        console.log(
          "OrderDetail useEffect: userString z localStorage:",
          userStringFromLocalStorage
        );

        let token = null;
        if (userStringFromLocalStorage) {
          try {
            const userData = JSON.parse(userStringFromLocalStorage);
            token = userData?.token;
            console.log("OrderDetail useEffect: Parsed user data:", userData);
          } catch (parseError) {
            console.error(
              "OrderDetail useEffect: Chyba při parsování 'user' z localStorage:",
              parseError
            );
            setError("Chyba: Data uživatele v prohlížeči jsou poškozena.");
            setLoading(false);
            navigate("/login");
            return;
          }
        }

        const response = await fetch(
          `https://localhost:7240/api/Order/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else if (response.status === 401) {
          setError("Vaše relace vypršela. Přihlaste se prosím znovu.");
          navigate("/login");
        } else if (response.status === 404) {
          setError("Objednávka nebyla nalezena nebo k ní nemáte přístup.");
        } else {
          const errorData = await response.json();
          setError(
            errorData.message || "Nepodařilo se načíst detail objednávky."
          );
        }
      } catch (err) {
        console.error("Chyba při načítání detailu objednávky:", err);
        setError(
          "Došlo k chybě při načítání detailu objednávky. Zkuste to prosím znovu."
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="order-detail-container loading-container">
        <span>Načítání detailu objednávky</span> <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="order-detail-container error-message">{error}</div>;
  }

  if (!order) {
    return (
      <div className="order-detail-container">Objednávka nebyla nalezena.</div>
    );
  }

  const formattedOrderDate = new Date(order.orderDate).toLocaleDateString(
    "cs-CZ",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <>
      <div className="order-detail-container">
        <h2>Detail objednávky #{order.id}</h2>
        <p>Datum: {formattedOrderDate}</p>
        <p>Celková cena: {order.totalAmount} Kč</p>
        <p>Status: {order.status}</p>
        <h3>Položky objednávky:</h3>
        {order.items && order.items.length > 0 ? (
          <ul>
            {order.items.map((item) => (
              <li key={item.productId}>
                {item.productName} - {item.quantity} ks - {item.price} Kč/ks
              </li>
            ))}
          </ul>
        ) : (
          <p>K této objednávce nebyly nalezeny žádné položky.</p>
        )}
        <button onClick={() => navigate("/my-orders")} className="btn-primary">
          Zpět na Moje objednávky
        </button>
      </div>
    </>
  );
};
export default OrderDetail;
