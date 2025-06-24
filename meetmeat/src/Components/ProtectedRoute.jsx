import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <span>Načítání autentizace</span> <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
