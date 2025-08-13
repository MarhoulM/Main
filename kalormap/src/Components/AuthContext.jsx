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

  const getUserData = async () => {
    const token = getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${BASE_URL}/api/UserData/getUserData`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  };
  const createUserData = async (
    gender,
    dateOfBirth,
    heightCm,
    weightKg,
    activityLevel,
    bmi,
    bmr,
    tdee
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
      const response = await fetch(`${BASE_URL}/api/UserData/createUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gender: parseInt(gender),
          dateOfBirth,
          heightCm: parseFloat(heightCm),
          weightKg: parseFloat(weightKg),
          activityLevel: parseInt(activityLevel),
          bmi: parseFloat(bmi),
          bmr: parseFloat(bmr),
          tdee: parseFloat(tdee),
        }),
      });

      const data = await response.json().catch(() => null);
      console.log("Odpověď z API při vytvoření UserData:", data);

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
        message: data?.message || "Data byla úspěšně vytvořena.",
        data: data,
      };
    } catch (error) {
      console.error("Chyba při vytváření UserData:", error);
      return {
        success: false,
        message: "Došlo k chybě při komunikaci s API.",
      };
    }
  };

  const updateUserGoals = async (protein, carbohydrate, fat, fiber, energy) => {
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
        `${BASE_URL}/api/UserNutrientGoal/UpdateUserNutrientGoal?userId=${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            protein: parseFloat(protein),
            carbohydrate: parseFloat(carbohydrate),
            fat: parseFloat(fat),
            fiber: parseFloat(fiber),
            energy: parseFloat(energy),
          }),
        }
      );
      const data = await response.json().catch(() => null);
      console.log("Odpověď z API při aktualizaci cílů:", data);
      console.log("HTTP status:", response.status);
      if (!response.ok) {
        console.error("Chyba při aktualizaci cílů:", response.status, data);
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
          message: "Cíle byly úspěšně aktualizovány (bez obsahu).",
        };
      }
      return { success: true, message: data.message || "Cíle aktualizovány." };
    } catch (error) {
      console.error("Došlo k chybě při volání API:", error);
      return { success: false, message: "Došlo k chybě při komunikaci s API." };
    }
  };
  const updateUserData = async (
    gender,
    dateOfBirth,
    heightCm,
    weightKg,
    activityLevel,
    bmi,
    bmr,
    tdee
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
      const response = await fetch(`${BASE_URL}/api/UserData/updateUserData`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gender: parseInt(gender),
          dateOfBirth,
          heightCm: parseFloat(heightCm),
          weightKg: parseFloat(weightKg),
          activityLevel: parseInt(activityLevel),
          bmi: parseFloat(bmi),
          bmr: parseFloat(bmr),
          tdee: parseFloat(tdee),
        }),
      });

      const data = await response.json().catch(() => null);
      console.log("Odpověď z API při aktualizaci UserData:", data);

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
        message: data?.message || "Data byla úspěšně aktualizována.",
        data: data,
      };
    } catch (error) {
      console.error("Chyba při aktualizaci UserData:", error);
      return {
        success: false,
        message: "Došlo k chybě při komunikaci s API.",
      };
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
    updateUserGoals,
    createUserData,
    updateUserData,
    getUserData,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
