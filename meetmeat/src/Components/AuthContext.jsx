import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "../Services/AuthService";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await AuthService.login(email, password);
    if (response.success) {
      setUser(response.data);
    }
    return response;
  };

  const register = async (username, email, password) => {
    const response = await AuthService.register(username, email, password);
    if (response.success) {
      setUser(response.data);
    }
    return response;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const getToken = () => {
    return user?.token;
  };

  const authContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    getToken,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
