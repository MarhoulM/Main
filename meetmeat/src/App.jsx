import { useEffect, useState, useCallback } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import ProductCard from "./Components/ProductCard";
import Footer from "./Components/Footer";
import Basket from "./Components/Basket";
import Profile from "./Components/Profile";
import Contact from "./Components/Contact";
import Login from "./Components/Login";
import Checkout from "./Components/Checkout";
import ThankYou from "./Components/ThankYou";
import MyOrders from "./Components/MyOrders";
import OrderDetail from "./Components/OrderDetail";
import ProductDetail from "./Components/ProductDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Components/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Pager from "./Components/Pager";
import FilterToggleSection from "./Components/FilterToggleSection";
import Loader from "./Components/Loader";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [queryParams, setQueryParams] = useState({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    category: "",
    minPrice: null,
    maxPrice: null,
    orderBy: "id",
  });

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (queryParams.pageNumber)
        params.append("pageNumber", queryParams.pageNumber);
      if (queryParams.pageSize) params.append("pageSize", queryParams.pageSize);
      if (queryParams.searchTerm)
        params.append("searchTerm", queryParams.searchTerm);
      if (queryParams.category) params.append("category", queryParams.category);
      if (queryParams.minPrice !== null && queryParams.minPrice !== "")
        params.append("minPrice", queryParams.minPrice);
      if (queryParams.maxPrice !== null && queryParams.maxPrice !== "")
        params.append("maxPrice", queryParams.maxPrice);
      if (queryParams.orderBy) params.append("orderBy", queryParams.orderBy);

      const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

      const url = `${API_BASE_URL}/api/products?${params.toString()}`;
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
      setTotalProducts(pagedResponse.totalCount);
      setTotalPages(pagedResponse.totalPages);
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

  const handlePageChange = (newPageNumber) => {
    setQueryParams((prev) => ({ ...prev, pageNumber: newPageNumber }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setQueryParams((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageNumber: 1,
    }));
  };

  const handleSearchChange = (newSearchTerm) => {
    setQueryParams((prev) => ({
      ...prev,
      searchTerm: newSearchTerm,
      pageNumber: 1,
    }));
  };

  const handleCategoryChange = (newCategory) => {
    setQueryParams((prev) => ({
      ...prev,
      category: newCategory,
      pageNumber: 1,
    }));
  };

  const handleMinPriceChange = (newMinPrice) => {
    setQueryParams((prev) => ({
      ...prev,
      minPrice: newMinPrice === "" ? null : parseFloat(newMinPrice),
      pageNumber: 1,
    }));
  };

  const handleMaxPriceChange = (newMaxPrice) => {
    setQueryParams((prev) => ({
      ...prev,
      maxPrice: newMaxPrice === "" ? null : parseFloat(newMaxPrice),
      pageNumber: 1,
    }));
  };

  const handleOrderByChange = (newOrderBy) => {
    setQueryParams((prev) => ({ ...prev, orderBy: newOrderBy, pageNumber: 1 }));
  };

  const handleClearFilters = () => {
    setQueryParams({
      pageNumber: 1,
      pageSize: 10,
      searchTerm: "",
      category: "",
      minPrice: null,
      maxPrice: null,
      orderBy: "id",
    });
  };

  return (
    <>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Navbar
              onSearch={handleSearchChange}
              searchTerm={queryParams.searchTerm}
              onSearchSubmit={() => {}}
              onClearSearch={handleClearFilters}
            />
            <div className="main-content">
              {loading && (
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <h2>Načítám produkty</h2>
                  <div className="loading-container">
                    <Loader />
                  </div>
                  <p>
                    Omlouváme se za zpoždění, načítám data z našeho serveru
                    MeetMeatApi.
                  </p>
                </div>
              )}
              {error && (
                <div
                  className="error-message-box"
                  style={{ padding: "20px", textAlign: "center", color: "red" }}
                >
                  <h2>Chyba při načítání produktů</h2>
                  <p>Došlo k chybě: {error}</p>
                  <p>
                    Zkontrolujte, zda je MeetMeatApi spuštěné a dostupné na{" "}
                    <strong>https://localhost:7240</strong>.
                  </p>
                  <p>
                    Také se ujistěte, že je správně nastavena CORS politika v
                    backendu pro <strong>https://localhost:8443</strong>.
                  </p>
                </div>
              )}

              {!loading && !error && (
                <Routes>
                  <Route
                    path="/"
                    element={
                      <div className="product-page-wrapper">
                        <ProductCard products={products} />
                        <Pager
                          currentPage={queryParams.pageNumber}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          pageSize={queryParams.pageSize}
                          onPageSizeChange={handlePageSizeChange}
                        />
                      </div>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <div className="product-page-wrapper">
                        <FilterToggleSection
                          queryParams={queryParams}
                          onCategoryChange={handleCategoryChange}
                          onMinPriceChange={handleMinPriceChange}
                          onMaxPriceChange={handleMaxPriceChange}
                          onOrderByChange={handleOrderByChange}
                          onClearFilters={handleClearFilters}
                        />
                        <ProductCard products={products} />
                        <Pager
                          currentPage={queryParams.pageNumber}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          pageSize={queryParams.pageSize}
                          onPageSizeChange={handlePageSizeChange}
                        />
                      </div>
                    }
                  />
                  <Route
                    path="/products/:productId"
                    element={<ProductDetail allProducts={products} />}
                  />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/basket" element={<Basket />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/thank-you" element={<ThankYou />} />
                  <Route
                    path="/my-orders"
                    element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-orders/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderDetail />
                      </ProtectedRoute>
                    }
                  />
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
              )}
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
