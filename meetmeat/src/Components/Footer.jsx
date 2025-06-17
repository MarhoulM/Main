import "./Footer.css";
import fb from "../svg/facebook.svg";
import ig from "../svg/instagram.svg";

const Fb = () => {
  return <img src={fb} alt="Facebook" />;
};

const Ig = () => {
  return <img src={ig} alt="Instagram" />;
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        &copy; {new Date().getFullYear()} MeetMeat. Všechna práva vyhrazena.
      </div>
      <div className="footer-bottom">
        <div className="Follow">Sledujte Nás </div>
        <div className="social-icons">
          <a href="https://instagram.com" className="icon">
            <Ig />
          </a>{" "}
          <a href="https://facebook.com" className="icon">
            <Fb />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
