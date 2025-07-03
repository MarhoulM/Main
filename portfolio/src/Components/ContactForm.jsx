import React, { useState } from "react";
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    console.log("Stav formData při odeslání:", formData);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setMessage("Prosím vyplňte všechna pole.");
      setMessageType("error");
      return;
    }
    if (!regex.test(formData.email)) {
      setMessage("Zadejte prosím platnou e-mailovou adresu.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    const emailData = {
      name: formData.name,
      email: formData.email,
      Subject: `Portfolio - Dotaz od ${formData.name} - ${formData.email}`,
      Body: `
        <h3>Nový dotaz z kontaktního formuláře</h3>
        <p><strong>Jméno:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Zpráva:</strong></p>
        <p>${formData.message.replace(/\n/g, "<br>")}</p>
      `,
      message: formData.message,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/Form.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        let errorResult;
        try {
          errorResult = await response.json();
        } catch (jsonError) {
          setMessage(
            "Chyba při odesílání dotazu: Server vrátil nečitelnou chybovou zprávu."
          );
          setMessageType("error");
          setLoading(false);
          return;
        }

        setMessage(
          `Chyba při odesílání dotazu: ${
            errorResult.message || "Neznámá chyba serveru."
          }`
        );
        setMessageType("error");
      } else {
        const result = await response.json();
        if (result.success) {
          setMessage(result.message || "Zpráva byla úspěšně odeslána!");
          setMessageType("success");
          setFormData({ name: "", email: "", message: "" });
        } else {
          setMessage(
            `Chyba při odesílání dotazu: ${result.message || "Neznámá chyba."}`
          );
          setMessageType("error");
        }
      }
    } catch (error) {
      setMessage(
        "Chyba při odesílání dotazu: Došlo k neočekávané síťové chybě. Zkuste to prosím znovu."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      <form role="form" className="contact-form" onSubmit={handleSubmit}>
        <h2>Chcete se na něco zeptat?</h2>

        {message && (
          <p className={`contact-form-message ${messageType}`}>{message}</p>
        )}

        <div className="form-group">
          <label htmlFor="name">Jméno:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Zadejte své jméno."
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Zadejte svůj e-mail."
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Zpráva:</label>
          <textarea
            name="message"
            id="message"
            placeholder="Napište mi, co vás zajímá."
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={loading}
          ></textarea>
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Odesílám..." : "Odeslat "}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
