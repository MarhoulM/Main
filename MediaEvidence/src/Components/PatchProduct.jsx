import PreviousBtn from "./PreviousBtn";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import "./PatchProduct.css";
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const PatchProduct = ({ onRefresh }) => {
  const { patchProduct } = useAuth();

  const [id, setId] = useState("");
  const [borrowed, setBorrowed] = useState("");
  const [availability, setAvailability] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await patchProduct(id, borrowed, availability);
    setApiResult(response);
    setMessage(response.message);
    setLoading(false);

    if (response.success) {
      setId("");
      setBorrowed("");
      setAvailability(false);
      if (onRefresh) onRefresh();
    }

    if (response.errors) {
      setErrors(response.errors);
    }
  };

  return (
    <>
      <div className="patch-container">
        <form onSubmit={handleSubmit} className="patch-form">
          <div className="product-id">
            <label htmlFor="id">ID</label>
            <input
              type="number"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="product-borrowed">
            <label htmlFor="borrowed">Zapůjčeno</label>
            <input
              type="text"
              id="borrowed"
              value={borrowed}
              onChange={(e) => setBorrowed(e.target.value || "")}
            />
          </div>
          <div className="product-available">
            <label htmlFor="available">Dostupnost</label>
            <select
              id="available"
              value={availability}
              onChange={(e) => setAvailability(e.target.value === "true")}
              className={errors.available ? "input-error" : ""}
            >
              <option value="">Vyberte...</option>
              <option value="false">Zapůjčeno</option>
              <option value="true">Dostupné</option>
            </select>
          </div>
          <button type="submit" className="button-submit" disabled={loading}>
            {loading ? "Odesílám..." : "Upravit"}
          </button>
          {errors.name && <p className="error">{errors.name}</p>}
          {message && (
            <p
              className={`form-message ${
                apiResult?.success ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}
        </form>
        <PreviousBtn />
      </div>
    </>
  );
};

export default PatchProduct;
