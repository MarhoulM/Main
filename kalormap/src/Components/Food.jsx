import { useEffect, useState } from "react";
import CreateFood from "./CreateFood";
import "./Food.css";
import PreviousBtn from "./PreviousBtn";
import { useAuth } from "./AuthContext";
const BASE_URL = import.meta.env.VITE_APP_API_URL;

const Food = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const { getToken } = useAuth();
  const token = getToken();

  const [showCreateFood, setShowCreateFood] = useState(false);
  const toggleCreation = () => {
    setShowCreateFood(!showCreateFood);
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
          `${BASE_URL}/api/UserFood/CreateFromDb?query=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Chyba při načítání potravin:", error);
      }
    };
    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <>
      <div className="food-container">
        <h3>Přidat potravinu</h3>
        <input
          className="search-input"
          type="text"
          placeholder="Vyhledat potravinu"
          value={searchTerm}
          onChange={handleSearchChange}
          id="searchInput"
          name="searchTerm"
        />
        <ul className="food-results">
          {results.length === 0 && searchTerm.length >= 2 && (
            <li>Žádné jídlo nenalezeno</li>
          )}
          {results.map((food) => (
            <li key={food.id}>
              {food.name} - {food.energy} kcal
            </li>
          ))}
        </ul>
        <div className="create-food-container">
          {results.length === 0 && searchTerm.length >= 2 && (
            <>
              <button type="button" onClick={toggleCreation}>
                {showCreateFood ? "Zrušit" : "Vytvořit potravinu"}
              </button>
              {showCreateFood && (
                <div className="create-food">
                  <CreateFood />
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

export default Food;
