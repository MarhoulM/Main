import { useEffect, useState } from "react";
import AuthService from "../Services/AuthService";

const BASE_URL = import.meta.env.VITE_APP_API_URL;

const useConsumed = (selectedDate) => {
  const [foods, setFoods] = useState([]);
  const token = AuthService.getToken();

  useEffect(() => {
    if (!selectedDate) return;
    const fetchFoods = async () => {
      try {
        const [getFood, getMeal] = await Promise.all([
          fetch(`${BASE_URL}/api/UserFood/readByDate?date=${selectedDate}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/api/MealFood/readMealFood?date=${selectedDate}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const userFoods = await getFood.json();
        const mealFoods = await getMeal.json();
        const allFoods = [...userFoods, ...mealFoods].sort(
          (a, b) => new Date(a.dateConsumed) - new Date(b.dateConsumed)
        );

        setFoods(allFoods);
      } catch (error) {
        console.error("Chyba při načítání jídel:", error);
      }
    };
    fetchFoods();
  }, [selectedDate]);
  return foods;
};
export default useConsumed;
