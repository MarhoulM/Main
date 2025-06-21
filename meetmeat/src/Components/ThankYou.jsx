import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import "./ThankYou.css";

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  return (
    <>
      <div className="thank-you-container">
        <h2>Děkujeme za Váš nákup.</h2>
        {orderId && (
          <p>
            Číslo vaší objednávky: <strong>#{orderId}</strong>
          </p>
        )}
        <p>Vaše objednávka byla úspěšně přijata a brzy bude zpracována.</p>
        <p>
          Na váš e-mail jsme zaslali potvrzení objednávky s dalšími detaily.
        </p>
        <button className="btn-primary" onClick={() => navigate("/products")}>
          Zpět na produkty
        </button>
      </div>
    </>
  );
};
export default ThankYou;
