import React, { useState } from "react";
import "./Contact.css";
import ContactForm from "./ContactForm";

const personalInfo = [
  {
    name: "Mistr Řezník -  Karel Klobása",
    phone: "+420 777 666 555",
    email: "karel.klobasa@meetmeat.cz",
  },
  {
    name: "Masožroutka - Anežka Pečeně",
    phone: "+420 606 123 456 (pouze v případě vážného hladu)",
    email: "pomoc@meetmeat.cz",
  },
  {
    name: "Hledač masa - František Flákota",
    phone: "+420 606 123 457",
    email: "dodavky@meetmeat.cz",
  },
];

const Contact = () => {
  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <h1>Kontakty</h1>
      <p>Můžete nám napsat o masíčku i pomocí formuláře.</p>
      <button className="toggleForm-btn" type="button" onClick={toggleForm}>
        {showForm ? "Skrýt formulář" : "Formulář"}
      </button>
      {showForm && (
        <div className="contactForm-section">
          <ContactForm />
        </div>
      )}
      <div className="contact-info">
        {personalInfo.map((contact, index) => (
          <div key={index} className="contact-item">
            <h2>{contact.name}</h2>
            <p>
              Telefon: <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </p>
            <p>
              Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          </div>
        ))}
      </div>
      <div className="info">
        <h2>Provozní doba:</h2>
        <p>Pondělí - Pátek: 8:00 - 18:00</p>
        <h2>Kde nás najdete:</h2>
        <p>U šťavnatého steaku 12, Praha 7, 170 00</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7238.127419845063!2d14.419393273913995!3d50.10379984875101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b94d2a798047b%3A0x1c00af1298630c30!2s170%2000%20Praha%207!5e0!3m2!1scs!2scz!4v1749543605870!5m2!1scs!2scz"
          width="486"
          height="364.5"
          style={{ border: 0 }}
          allowFulScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="MeetMeat Location"
        ></iframe>
      </div>
    </>
  );
};

export default Contact;
