import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { AuthProvider } from "./Components/AuthContext";
import Navbar from "./Components/Navbar";
import FilterControl from "./Components/FilterControl";
import Profile from "./Components/Profile";
import Settings from "./Components/Settings";
import Content from "./Components/Content";
import "./App.css";
import CreateProduct from "./Components/CreateProduct";
import UpdateProduct from "./Components/UpdateProduct";
import DeleteProduct from "./Components/DeleteProduct";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [queryParams, setQueryParams] = useState({
    searchTerm: "",
    category: "",
    genre: "",
    availability: "",
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (queryParams.searchTerm)
        params.append("query", queryParams.searchTerm);
      if (queryParams.category) params.append("category", queryParams.category);
      if (queryParams.genre) params.append("genre", queryParams.genre);
      if (queryParams.availability)
        params.append("availability", queryParams.availability);

      const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

      const url = `${API_BASE_URL}/api/product/searchProduct?${params.toString()}`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `HTTP chyba! Status: ${response.status}. Detaily: ${errorData}`
        );
      }

      const pagedResponse = await response.json();
      setProducts(pagedResponse.data);
    } catch (error) {
      console.error("Nepodařilo se načíst produkty", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [queryParams, fetchProducts]);

  const handleSearchChange = (newSearchTerm) => {
    setQueryParams((prev) => ({
      ...prev,
      searchTerm: newSearchTerm,
    }));
  };

  const handleCategoryChange = (newCategory) => {
    setQueryParams((prev) => ({
      ...prev,
      category: newCategory,
    }));
  };

  const handleGenreChange = (newGenre) => {
    setQueryParams((prev) => ({
      ...prev,
      genre: newGenre,
    }));
  };

  const handleAvailabilityChange = (newAvailability) => {
    setQueryParams((prev) => ({
      ...prev,
      availability: newAvailability,
    }));
  };

  const handleClearFilters = () => {
    setQueryParams({
      searchTerm: "",
      category: "",
      genre: "",
    });
  };

  return (
    <>
      <AuthProvider>
        <Router>
          <Navbar
            onSearch={handleSearchChange}
            searchTerm={queryParams.searchTerm}
            onSearchSubmit={() => {}}
            onClearSearch={handleClearFilters}
          />
          <FilterControl
            queryParams={queryParams}
            onCategoryChange={handleCategoryChange}
            onGenreChange={handleGenreChange}
            onAvailabilityChange={handleAvailabilityChange}
            onClearFilters={handleClearFilters}
          />
          <Routes>
            <Route
              path="/"
              element={
                <div className="content-container">
                  {loading && <p>Načítám produkty...</p>}
                  {error && <p className="error">Chyba: {error}</p>}
                  <Content products={products} />
                </div>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/add" element={<CreateProduct />} />
            <Route path="/update" element={<UpdateProduct />} />
            <Route path="/delete" element={<DeleteProduct />} />
            <Route
              path="*"
              element={
                <div style={{ padding: "50px", textAlign: "center" }}>
                  <h2>Stránka nenalezena (404)</h2>
                  <p>Omlouváme se, tato stránka neexistuje.</p>
                </div>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
