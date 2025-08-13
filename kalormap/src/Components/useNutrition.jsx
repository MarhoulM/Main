import { useEffect, useState } from "react";
import AuthService from "../Services/AuthService";
const BASE_URL = import.meta.env.VITE_APP_API_URL;

const useNutrition = (selectedDateProp) => {
  const [summary, setSummary] = useState(null);
  const token = AuthService.getToken();
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedDate =
    selectedDateProp ?? new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchSummary = async () => {
      console.log("Datum:", selectedDate);
      try {
        const response = await fetch(
          `${BASE_URL}/api/UserNutritionAnalysis/summary?date=${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          console.error("Server returned error:", response.status, text);
          throw new Error(text || "Nepodařilo se načíst summary.");
        }

        const data = await response.json();
        console.log("Stažené summary:", data);
        setSummary(data);
      } catch (error) {
        console.error("Chyba při načítání summary:", error);
      }
    };

    fetchSummary();
  }, [refreshKey, selectedDate]);
  const reloadSummary = () => setRefreshKey((x) => x + 1);

  return { summary, reloadSummary };
};

export default useNutrition;
