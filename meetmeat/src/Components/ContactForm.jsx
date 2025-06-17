import React, { useState } from "react";
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    e.preventDefault();
    setMessage("");
    setLoading(true);
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setMessage("Prosím vyplňte všechna pole.");
      setLoading(false);
      return;
    }
    if (!regex.test(formData.email)) {
      setMessage("Zadejte prosím platnou e-mailovou adresu.");
      setLoading(false);
      return;
    }

    const emailData = {
      To: "tiridox@gmail.com",
      Subject: `MeetMeat - Dotaz od ${formData.name} - ${formData.email}`,
      Body: `
        <h3>Nový dotaz z kontaktního formuláře</h3>
        <p><strong>Jméno:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Zpráva:</strong></p>
        <p>${formData.message.replace(/\n/g, "<br>")}</p>
    `,
    };

    try {
      const response = await fetch("https://localhost:7240/api/Email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        setMessage("Váš dotaz byl úspěšně odeslán!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const errorData = await response.json();
        setMessage(
          `Chyba při odesílání dotazu: ${errorData.message || "Neznámá chyba."}`
        );
        console.error("Chyba z backendu:", errorData);
      }
    } catch (error) {
      console.error("Došlo k chybě během odesílání dotazu:", error);
      setMessage(
        "Došlo k neočekávané chybě během odesílání dotazu. Zkuste to prosím znovu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="contact-form" onSubmit={handleSubmit}>
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
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Zpráva:</label>
          <textarea
            name="message"
            id="message"
            placeholder="Napište nám, co vás zajímá."
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button className="submit" type="submit" disabled={loading}>
            {loading ? "Odesílám..." : "Odeslat "}
          </button>
        </div>
        {message && (
          <p
            className={`contact-form-message ${
              message.includes("chyba") ? "error" : "success"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </>
  );
};

export default ContactForm;
