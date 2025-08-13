import { useEffect, useState } from "react";
import CreateMeal from "./CreateMeal";
import "./Meal.css";
import PreviousBtn from "./PreviousBtn";
const BASE_URL = import.meta.env.VITE_APP_API_URL;

const Meal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const [showCreateMeal, setShowCreateMeal] = useState(false);
  const toggleCreation = () => {
    setShowCreateMeal(!showCreateMeal);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/api/MealFood/Search?query=${searchTerm}`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Chyba při načítání jídel:", error);
      }
    };
    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <>
      <div className="meal-container">
        <h3>Přidat jídlo</h3>
        <input
          className="search-input"
          type="text"
          placeholder="Vyhledat jídlo"
          value={searchTerm}
          onChange={handleSearchChange}
          id="searchInput"
          name="searchTerm"
        />
        <ul className="meal-results">
          {results.length === 0 && searchTerm.length >= 2 && (
            <li>Žádné jídlo nenalezeno</li>
          )}
          {results.map((meal) => (
            <li key={meal.id}>
              {meal.name} - {meal.energy} kcal
            </li>
          ))}
        </ul>
        <div className="create-meal-container">
          {results.length === 0 && searchTerm.length >= 2 && (
            <>
              <button type="button" onClick={toggleCreation}>
                {showCreateMeal ? "Zrušit" : "Vytvořit jídlo"}
              </button>
              {showCreateMeal && (
                <div className="create-meal">
                  <CreateMeal />
                </div>
              )}
            </>
          )}
        </div>
        <PreviousBtn />
      </div>
    </>
  );
};
export default Meal;
