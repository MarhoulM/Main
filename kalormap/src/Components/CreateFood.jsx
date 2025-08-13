import { useState } from "react";
import { useAuth } from "./AuthContext";
import "./CreateFood.css";

const CreateFood = () => {
  const [foodProtein, setFoodProtein] = useState("");
  const [foodCarbo, setFoodCarbo] = useState("");
  const [foodFat, setFoodFat] = useState("");
  const [foodFiber, setFoodFiber] = useState("");
  const [foodEnergy, setFoodEnergy] = useState("");
  const [foodAmount, setFoodAmount] = useState("");
  const [foodConsumed, setFoodConsumed] = useState(new Date());
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  const { createFood } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});
    setApiResult(null);
    setLoading(true);

    try {
      const result = await createFood(
        foodProtein,
        foodCarbo,
        foodFat,
        foodFiber,
        foodEnergy,
        foodAmount,
        foodConsumed
      );
      setApiResult(result);
      if (result.success) {
        setMessage(result.message);
      } else {
        setMessage(result.message || "Vytvoření potraviny se nezdařilo.");
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      console.error(
        "Došlo k neočekávané chybě během vytváření potraviny.",
        error
      );
      setMessage("Došlo k neočekáváné chybě během vytváření potraviny.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="food-creation">
        <form onSubmit={handleSubmit} className="food-form">
          <div className="food-protein">
            <label htmlFor="fp">Protein [g]</label>
            <input
              id="fp"
              type="number"
              inputMode="decimal"
              step="any"
              value={foodProtein}
              onChange={(e) => {
                const raw = e.target.value.replace(",", ".");
                setFoodProtein(raw);
              }}
              className={errors.foodProtein ? "input-error" : ""}
            />
          </div>
          <div className="food-carbo">
            <label htmlFor="fg">Cukr [g]</label>
            <input
              id="fg"
              type="number"
              inputMode="decimal"
              step="any"
              value={foodCarbo}
              onChange={(e) => {
                const raw = e.target.value.replace(",", ".");
                setFoodCarbo(raw);
              }}
              className={errors.foodCarbo ? "input-error" : ""}
            />
          </div>
          <div className="food-fat">
            <label htmlFor="ff">Tuk [g]</label>
            <input
              id="ff"
              type="number"
              inputMode="decimal"
              step="any"
              value={foodFat}
              onChange={(e) => {
                const raw = e.target.value.replace(",", ".");
                setFoodFat(raw);
              }}
              className={errors.foodFat ? "input-error" : ""}
            />
          </div>
          <div className="food-fiber">
            <label htmlFor="ffib">Vláknina [g]</label>
            <input
              id="ffib"
              type="number"
              inputMode="decimal"
              step="any"
              value={foodFiber}
              onChange={(e) => {
                const raw = e.target.value.replace(",", ".");
                setFoodFiber(raw);
              }}
              className={errors.foodFiber ? "input-error" : ""}
            />
          </div>
          <div className="food-energy">
            <label htmlFor="fe">Energie [kcal]</label>
            <input
              id="fe"
              type="number"
              inputMode="decimal"
              step="any"
              value={foodEnergy}
              onChange={(e) => {
                const raw = e.target.value.replace(",", ".");
                setFoodEnergy(raw);
              }}
              className={errors.foodEnergy ? "input-error" : ""}
            />
          </div>
          <div className="food-amount">
            <label htmlFor="fa">Množství [g]</label>
            <input
              id="fa"
              type="number"
              inputMode="decimal"
              step="any"
              value={foodAmount}
              onChange={(e) => {
                const raw = e.target.value.replace(",", ".");
                setFoodAmount(raw);
              }}
              className={errors.foodAmount ? "input-error" : ""}
            />
          </div>
          <div className="food-date">
            <label htmlFor="fd">Datum konzumace</label>
            <input
              id="fd"
              type="date"
              value={foodConsumed.toISOString().split("T")[0]}
              onChange={(e) => {
                setFoodConsumed(new Date(e.target.value));
              }}
              className={errors.foodConsumed ? "input-error" : ""}
            />
          </div>
          {message && <p className="form-message">{message}</p>}
          {apiResult && !apiResult.success && (
            <ul className="form-errors">
              {Object.entries(errors).map(([key, val]) => (
                <li key={key}>{val}</li>
              ))}
            </ul>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Ukládám..." : "Uložit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateFood;
