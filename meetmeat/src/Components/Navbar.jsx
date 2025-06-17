import "./Navbar.css";
import React from "react";
import home from "../svg/MeetMeat.svg";
import profile from "../svg/profile-circle.svg";
import cart from "../svg/cart.svg";
import contact from "../svg/message.svg";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

const placeholders = [
  "Na co se ti sbíhají sliny?",
  "Hledáš něco speciálního?",
  "Na co máš chuť?",
  "Objev nové chutě!",
  "Ty nejsi líný se najíst!",
  "Už se to suší!",
  "Ježiš to je dobrý!",
];

const getPlaceholder = () => {
  return placeholders[Math.floor(Math.random() * placeholders.length)];
};

const HomeIcon = () => {
  return <img src={home} alt="Domů" />;
};

const ContactIcon = () => {
  return <img src={contact} alt="Kontakt" />;
};

const ProfileIcon = () => {
  return <img src={profile} alt="Profil" />;
};

const ShoppingCartIcon = () => {
  return <img src={cart} alt="Košík" />;
};

const Navbar = ({ onSearch, searchTerm, onSearchSubmit, onClearSearch }) => {
  const [placeholder, setPlaceholder] = React.useState(getPlaceholder());
  const navigate = useNavigate();

  const handleInputClick = () => {
    setPlaceholder(getPlaceholder());
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const handleSearchBtnClick = () => {
    onSearchSubmit(searchTerm);
    navigate("/products");
  };

  const handleHomeClick = () => {
    onClearSearch();
    navigate("/products");
  };

  const { getTotalItems } = useCart();

  return (
    <>
      <div className="navbar">
        <div className="home nav-item">
          <a
            href="#"
            onClick={() => {
              handleHomeClick();
            }}
          >
            <HomeIcon />
          </a>
        </div>
        <div className="search">
          <input
            className="search-input"
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={handleInputClick}
          />
          <button className="search-btn" onClick={handleSearchBtnClick}>
            Hledat
          </button>
        </div>
        <div className="right-side">
          <div className="contact nav-item">
            <a href="#" onClick={() => navigate("/contact")}>
              <ContactIcon />
            </a>
          </div>
          <div className="profile nav-item">
            <a href="#" onClick={() => navigate("/profile")}>
              <ProfileIcon />
            </a>
          </div>
          <div className="basket nav-item">
            <a href="#" onClick={() => navigate("/basket")}>
              <ShoppingCartIcon />
              <span className="cart-item-count">{getTotalItems()}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
