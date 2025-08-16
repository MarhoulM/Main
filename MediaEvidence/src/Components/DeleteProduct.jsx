import PreviousBtn from "./PreviousBtn";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import "./DeleteProduct.css";
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const DeleteProduct = ({ onRefresh }) => {
  const { deleteProduct } = useAuth();
  const [id, setId] = useState("");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await deleteProduct(id);
    setMessage(response.message);
    setLoading(false);

    if (response.success) {
      setId("");
      if (onRefresh) onRefresh();
    }

    if (response.errors) {
      setErrors(response.errors);
    }
  };

  return (
    <>
      <div className="delete-container">
        <form onSubmit={handleSubmit} className="delete-form">
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
          <button type="submit" className="button-submit" disabled={loading}>
            {loading ? "Odesílám..." : "Smazat"}
          </button>
          {errors.name && <p className="error">{errors.name}</p>}
          {message && <p className="message">{message}</p>}
        </form>
        <PreviousBtn />
      </div>
    </>
  );
};

export default DeleteProduct;
