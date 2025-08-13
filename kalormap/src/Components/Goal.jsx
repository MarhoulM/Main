import { useState } from "react";
import { useAuth } from "./AuthContext";
import "./Goal.css";
import useNutrition from "./useNutrition";
import PreviousBtn from "./PreviousBtn";

const Goal = () => {
  const [proteinGoal, setProteinGoal] = useState("");
  const [carboGoal, setCarboGoal] = useState("");
  const [fatGoal, setFatGoal] = useState("");
  const [fiberGoal, setFiberGoal] = useState("");
  const [energyGoal, setEnergyGoal] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [update, setUpdate] = useState(false);

  const { summary } = useNutrition();

  const { updateUserGoals } = useAuth();

  const handleUpdateBtn = () => {
    setUpdate(true);
    setMessage("");
    setErrors({});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});
    setApiResult(null);
    setLoading(true);

    try {
      const result = await updateUserGoals(
        proteinGoal,
        carboGoal,
        fatGoal,
        fiberGoal,
        energyGoal
      );
      setApiResult(result);
      if (result.success) {
        setMessage(result.message || "Cíle aktualizovány.");
        setUpdate(false);
      } else {
        setMessage(result.message || "Aktualizace cílů se nezdařila.");
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      console.error("Došlo k neočekávané chybě během aktualizace cílů.", error);
      setMessage("Došlo k neočekáváné chybě během aktualizace cílů.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="goal-container">
        <h3>Vaše cíle:</h3>
        {update ? (
          <form onSubmit={handleSubmit} className="goal-form">
            <div className="protein-goal">
              <label htmlFor="pg">Protein</label>
              <input
                id="pg"
                type="number"
                inputMode="decimal"
                step="any"
                value={proteinGoal}
                onChange={(e) => {
                  const raw = e.target.value.replace(",", ".");
                  setProteinGoal(raw);
                }}
                className={errors.proteinGoal ? "input-error" : ""}
              />
              <span className="unit">[g]</span>
            </div>
            <div className="carbo-goal">
              <label htmlFor="cg">Cukr</label>
              <input
                id="cg"
                type="number"
                inputMode="decimal"
                step="any"
                value={carboGoal}
                onChange={(e) => {
                  const raw = e.target.value.replace(",", ".");
                  setCarboGoal(raw);
                }}
                className={errors.carboGoal ? "input-error" : ""}
              />
              <span className="unit">[g]</span>
            </div>
            <div className="fat-goal">
              <label htmlFor="fg">Tuk</label>
              <input
                id="fg"
                type="number"
                inputMode="decimal"
                step="any"
                value={fatGoal}
                onChange={(e) => {
                  const raw = e.target.value.replace(",", ".");
                  setFatGoal(raw);
                }}
                className={errors.fatGoal ? "input-error" : ""}
              />
              <span className="unit">[g]</span>
            </div>
            <div className="fiber-goal">
              <label htmlFor="fibg">Vláknina</label>
              <input
                id="fibg"
                type="number"
                inputMode="decimal"
                step="any"
                value={fiberGoal}
                onChange={(e) => {
                  const raw = e.target.value.replace(",", ".");
                  setFiberGoal(raw);
                }}
                className={errors.fiberGoal ? "input-error" : ""}
              />
              <span className="unit">[g]</span>
            </div>
            <div className="energy-goal">
              <label htmlFor="eg">Energie</label>
              <input
                id="eg"
                type="number"
                inputMode="decimal"
                step="any"
                value={energyGoal}
                onChange={(e) => {
                  const raw = e.target.value.replace(",", ".");
                  setEnergyGoal(raw);
                }}
                className={errors.energyGoal ? "input-error" : ""}
              />
              <span className="unit">[kcal]</span>
            </div>
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Ukládám..." : "Uložit"}
            </button>
            {message && (
              <p
                className={`form-message ${
                  apiResult?.success ? "success" : "error"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        ) : (
          <>
            <div className="protein-goal">
              {" "}
              Protein: {summary?.goalProtein} [g]
            </div>
            <div className="carbo-goal">
              Cukry: {summary?.goalCarbohydrate} [g]
            </div>
            <div className="fat-goal">Tuky: {summary?.goalFat} [g]</div>
            <div className="fiber-goal">Vláknina: {summary?.goalFiber} [g]</div>
            <div className="energy-goal">
              Kalorie: {summary?.goalCalories} [kcal]
            </div>
          </>
        )}
        <button
          type="button"
          className="button"
          onClick={handleUpdateBtn}
          disabled={loading}
        >
          {update ? "Zrušit" : "Upravit"}
        </button>
        <PreviousBtn />
      </div>
    </>
  );
};

export default Goal;
