import { useEffect, useState } from "react";
import AuthService from "../Services/AuthService";
const BASE_URL = import.meta.env.VITE_APP_API_URL;

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const token = AuthService.getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/UserData/getUserData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("Server returned error:", response.status, text);
          throw new Error(text || "Nepodařilo se načíst data.");
        }

        const data = await response.json();
        console.log("Stažená data:", data);
        setUserData(data);
      } catch (error) {
        console.error("Chyba při načítání dat:", error);
      }
    };

    fetchData();
  }, [token]);

  return { userData };
};

export default useUserData;
