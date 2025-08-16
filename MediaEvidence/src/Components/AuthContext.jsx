import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "../Services/AuthService";
const BASE_URL = import.meta.env.VITE_APP_API_URL;

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
      console.log(
        "AuthContext: Uživatel NALEZEN v localStorage. IsAuthenticated:",
        !!storedUser
      );
    }
    setLoading(false);
    console.log("AuthContext: Loading nastaveno na FALSE.");
  }, []);

  const login = async (email, password) => {
    const response = await AuthService.login(email, password);
    if (response.success) {
      setUser(response.data);
      console.log(
        "AuthContext: Login úspěšný, uživatel nastaven:",
        response.data
      );
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

  const createProduct = async (
    name,
    author,
    director,
    category,
    genre,
    description,
    dateOfAcquisition,
    availability
  ) => {
    const token = getToken();
    const userId = user?.id ?? user?.userId;

    if (!token) {
      return { success: false, message: "Chybí token. Přihlaste se znovu." };
    }
    if (!userId) {
      return { success: false, message: "Chybí userId uživatele." };
    }

    try {
      const response = await fetch(`${BASE_URL}/api/Product/createProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          author,
          director,
          category,
          genre,
          description,
          dateOfAcquisition,
          availability,
        }),
      });

      const data = await response.json().catch(() => null);
      console.log("Odpověď z API při vytvoření Produktu:", data);

      if (!response.ok) {
        return {
          success: false,
          message:
            data?.message || `Chyba serveru (status ${response.status}).`,
          errors: data?.errors || null,
        };
      }

      return {
        success: true,
        message: data?.message || "Produkt byl úspěšně vytvořen.",
        data: data,
      };
    } catch (error) {
      console.error("Chyba při vytváření Pproduktu:", error);
      return {
        success: false,
        message: "Došlo k chybě při komunikaci s API.",
      };
    }
  };

  const updateProduct = async (
    name,
    author,
    director,
    category,
    genre,
    description,
    dateOfAcquisition,
    availability
  ) => {
    const token = getToken();
    const userId = user?.id ?? user?.userId;
    console.log("Uživatel v kontextu:", user);
    if (!token) {
      return { success: false, message: "Chybí token. Přihlaste se znovu." };
    }
    if (!userId) {
      return { success: false, message: "Chybí userId uživatele." };
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/Product/updateProduct?userId=${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            author,
            director,
            category,
            genre,
            description,
            dateOfAcquisition,
            availability,
          }),
        }
      );
      const data = await response.json().catch(() => null);
      console.log("Odpověď z API při aktualizaci produktu:", data);
      console.log("HTTP status:", response.status);
      if (!response.ok) {
        console.error("Chyba při aktualizaci produktu:", response.status, data);
        return {
          success: false,
          message:
            data?.message || `Server vrátil chybu (status ${response.status}).`,
          errors: data?.errors || null,
        };
      }
      if (response.status === 204) {
        return {
          success: true,
          message: "Produkt byl úspěšně aktualizován.",
        };
      }
      return {
        success: true,
        message: data.message || "Produkt aktualizován.",
      };
    } catch (error) {
      console.error("Došlo k chybě při volání API:", error);
      return { success: false, message: "Došlo k chybě při komunikaci s API." };
    }
  };

  const deleteProduct = async (productId) => {
    const token = getToken();
    const userId = user?.id ?? user?.userId;
    console.log("Uživatel v kontextu:", user);
    if (!token) {
      return { success: false, message: "Chybí token. Přihlaste se znovu." };
    }
    if (!userId) {
      return { success: false, message: "Chybí userId uživatele." };
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/Product/deleteProduct/${productId}?userId=${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        return {
          success: true,
          message: "Produkt byl úspěšně aktualizován.",
        };
      }
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        console.error("Chyba při aktualizaci produktu:", response.status, data);
        return {
          success: false,
          message:
            data?.message || `Server vrátil chybu (status ${response.status}).`,
          errors: data?.errors || null,
        };
      }
      return {
        success: true,
        message: data.message || "Produkt aktualizován.",
      };
    } catch (error) {
      console.error("Došlo k chybě při volání API:", error);
      return { success: false, message: "Došlo k chybě při komunikaci s API." };
    }
  };

  const authContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    getToken,
    updateProduct,
    createProduct,
    deleteProduct,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
