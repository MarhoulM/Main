import { useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderNotes, setOrderNotes] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { cartItems, getTotalItems, getTotalPrice, clearCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);
    setFormErrors({});

    if (cartItems.length === 0) {
      alert("Váš košík zeje prázdnotou. Přidejte prosím produkty do košíku.");
      return;
    }
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setMessage("Prosím opravte chyby ve formuláři.");
      setLoading(false);
      return;
    } else {
      setFormErrors(errors);
    }

    const orderItemsForBackend = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const orderData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      address: address,
      city: city,
      zipCode: zipCode,
      phone: phone,
      deliveryMethod: deliveryMethod,
      paymentMethod: paymentMethod,
      items: orderItemsForBackend,
      note: orderNotes,
    };

    try {
      const response = await fetch("https://localhost:7240/api/Order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || "Objednávka byla úspěšně odeslána.");
        clearCart();
        navigate("/thank-you");
      } else {
        const errorData = await response.json();
        setMessage(
          `Chyba při odesílání objednávky: ${
            errorData.message || "Neznámá chyba."
          }`
        );
        console.error("Chyba z backendu:", errorData);
        if (errorData.errors) {
          let backendErrors = "";
          for (const key in errorData.errors) {
            backendErrors += `${key}: ${errorData.errors[key].join(", ")}\n`;
          }
          setMessage(`Chyby backendu:\n${backendErrors}`);
        }
      }
    } catch (error) {
      console.error("Došlo k chybě během odesílání objednávky:", error);
      setMessage(
        "Došlo k neočekávané chybě během odesílání objednávky. Zkuste to prosím znovu."
      );
    } finally {
      setLoading(false);
    }
  };
  const validateForm = () => {
    const errors = {};
    if (!firstName.trim()) errors.firstName = "Jméno je povinné.";
    if (!lastName.trim()) errors.lastName = "Příjmení je povinné.";
    if (!email.trim()) errors.email = "E-mail je povinný.";
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.email = "Neplatný formát e-mailu.";
    if (!address.trim()) errors.address = "Adresa je povinná.";
    if (!city.trim()) errors.city = "Město je povinné.";
    if (!zipCode.trim()) errors.zipCode = "PSČ je povinné.";
    else if (!/^\d{5}$/.test(zipCode))
      errors.zipCode = "PSČ musí mít 5 číslic.";
    if (!phone.trim()) errors.phone = "Telefon je povinný.";
    else if (!/^\+?\d{9,}$/.test(phone))
      errors.phone = "Neplatný formát telefonu.";

    return errors;
  };
  return (
    <>
      <div className="checkout-container">
        <h2>Dokončení objednávky</h2>
        <h3>Souhrn košíku ({getTotalItems()} položek)</h3>
        {cartItems && cartItems.length > 0 ? (
          <>
            <ul className="cart-summary-list">
              {cartItems.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.quantity}x - {item.price * item.quantity}{" "}
                  {item.currency || "Kč"}
                </li>
              ))}
            </ul>
            <p className="total-price">Celková cena: {getTotalPrice()} Kč</p>
            <form onSubmit={handleSubmit} className="checkout-form">
              <h3>Doručovací údaje</h3>
              <div className="form-group">
                <label htmlFor="firstName">Jméno:</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                {formErrors.firstName && (
                  <p className="error-message">{formErrors.firstName}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Příjmení:</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                {formErrors.lastName && (
                  <p className="error-message">{formErrors.lastName}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {formErrors.email && (
                  <p className="error-message">{formErrors.email}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="address">Adresa:</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                {formErrors.address && (
                  <p className="error-message">{formErrors.address}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="city">Město:</label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                {formErrors.city && (
                  <p className="error-message">{formErrors.city}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">PSČ:</label>
                <input
                  type="text"
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
                {formErrors.zipCode && (
                  <p className="error-message">{formErrors.zipCode}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Telefon:</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {formErrors.phone && (
                  <p className="error-message">{formErrors.phone}</p>
                )}
              </div>
              <h3>Doprava a platba</h3>
              <div className="form-group">
                <h3>Doprava:</h3>
                <label>
                  <input
                    name="deliveryMethod"
                    type="radio"
                    value="standard"
                    checked={deliveryMethod === "standard"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  />
                  Standardní doprava 125 Kč
                </label>
                <label>
                  <input
                    name="deliveryMethod"
                    type="radio"
                    value="pickupStore"
                    checked={deliveryMethod === "pickupStore"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  />
                  Osobní odběr na prodejně.
                </label>
                <label>
                  <input
                    name="deliveryMethod"
                    type="radio"
                    value="pickupBox"
                    checked={deliveryMethod === "pickupBox"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  />
                  Osobní odběr v boxu.
                </label>
              </div>
              <div className="form-group">
                <h3>Platba:</h3>
                <label>
                  <input
                    name="paymentMethod"
                    type="radio"
                    value="cash-on-delivery"
                    checked={paymentMethod === "cash-on-delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Platba při převzetí
                </label>
                <label>
                  <input
                    name="paymentMethod"
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Online platba kartou
                </label>
              </div>
              <div className="order-notes">
                <h3>Poznámky k objednávce</h3>
                <label htmlFor="orderNotes">Poznámky:</label>
                <textarea
                  id="orderNotes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows="4"
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">
                Odeslat objednávku
              </button>
            </form>
          </>
        ) : (
          <>
            <p>Váš košík je prázdný.</p>
            <button onClick={() => navigate("/products")}>
              Zpět na produkty
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Checkout;
