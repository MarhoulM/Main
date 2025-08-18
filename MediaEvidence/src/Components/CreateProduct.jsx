import { useState } from "react";
import { useAuth } from "./AuthContext";
import PreviousBtn from "./PreviousBtn";
import "./CreateProduct.css";
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const CreateProduct = ({ onRefresh }) => {
  const { createProduct } = useAuth();
  const [apiResult, setApiResult] = useState(null);

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [director, setDirector] = useState("");
  const [category, setCategory] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [borrowed, setBorrowed] = useState("");
  const [dateOfAcquisition, setDateOfAcquisition] = useState("2025-01-01");
  const [availability, setAvailability] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await createProduct(
      name,
      author,
      director,
      category,
      genre,
      description,
      borrowed,
      dateOfAcquisition,
      availability
    );
    setApiResult(response);
    setMessage(response.message);
    setLoading(false);

    if (response.success) {
      setName("");
      setAuthor("");
      setDirector("");
      setCategory("");
      setGenre("");
      setDescription("");
      setBorrowed("");
      setDateOfAcquisition("2025-01-01");
      setAvailability(false);
      if (onRefresh) onRefresh();
    }

    if (response.errors) {
      setErrors(response.errors);
    }
  };

  return (
    <>
      <div className="create-container">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="product-name">
            <label htmlFor="name">Název</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="product-author">
            <label htmlFor="author">Autor (volitelné)</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value || "")}
            />
          </div>
          <div className="product-director">
            <label htmlFor="director">Režisér (volitelné)</label>
            <input
              type="text"
              id="director"
              value={director}
              onChange={(e) => setDirector(e.target.value || "")}
            />
          </div>
          <div className="product-category">
            <label htmlFor="category">Kategorie</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={errors.category ? "input-error" : ""}
            >
              <option value="">Vyberte...</option>
              <option value="Kniha">Kniha</option>
              <option value="CD">CD</option>
              <option value="DVD">DVD</option>
            </select>
          </div>
          <div className="product-genre">
            <label htmlFor="genre">Žánr</label>
            <input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
          <div className="product-description">
            <label htmlFor="description">Popis</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="product-borrowed">
            <label htmlFor="borrowed">Zapůjčeno (volitelné)</label>
            <input
              type="text"
              id="borrowed"
              value={borrowed}
              onChange={(e) => setBorrowed(e.target.value || "")}
            />
          </div>
          <div className="product-doa">
            <label htmlFor="doa">Datum pořízení</label>
            <input
              type="date"
              id="doa"
              value={dateOfAcquisition}
              onChange={(e) => setDateOfAcquisition(e.target.value)}
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
            {loading ? "Odesílám..." : "Vytvořit"}
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

export default CreateProduct;
