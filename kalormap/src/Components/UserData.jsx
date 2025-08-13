import { useState } from "react";
import { useAuth } from "./AuthContext";
import "./UserData.css";
import useUserData from "./useUserData";
import PreviousBtn from "./PreviousBtn";

const UserData = () => {
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [bmi, setBMI] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [update, setUpdate] = useState(false);

  const { userData } = useUserData();

  const { createUserData, getUserData, updateUserData } = useAuth();

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
      const isNewUserData =
        !userData ||
        userData.heightCm === 0 ||
        userData.weightKg === 0 ||
        userData.bmi === 0;

      const result = isNewUserData
        ? await createUserData(
            gender,
            dateOfBirth,
            heightCm,
            weightKg,
            activityLevel,
            bmi,
            userData?.bmr ?? 0,
            userData?.tdee ?? 0
          )
        : await updateUserData(
            gender,
            dateOfBirth,
            heightCm,
            weightKg,
            activityLevel,
            bmi,
            userData?.bmr ?? 0,
            userData?.tdee ?? 0
          );
      setApiResult(result);
      if (result.success) {
        setMessage(result.message || "Data aktualizována.");
        setUpdate(false);
        const refreshed = await getUserData();
        console.log("Načtená data po uložení:", refreshed);
      } else {
        setMessage(result.message || "Aktualizace dat se nezdařila.");
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      console.error("Došlo k neočekávané chybě během aktualizace dat.", error);
      setMessage("Došlo k neočekáváné chybě během aktualizace dat.");
    } finally {
      setLoading(false);
    }
  };

  const getGenderLabel = (gender) => {
    switch (gender) {
      case 1:
        return "Muž";
      case 2:
        return "Žena";
      default:
        return "Neurčeno";
    }
  };

  const getActivityLabel = (level) => {
    switch (level) {
      case 0:
        return "Sedavý";
      case 1:
        return "Lehká aktivita";
      case 2:
        return "Střední aktivita";
      case 3:
        return "Aktivní";
      case 4:
        return "Velmi aktivní";
      default:
        return "Neurčeno";
    }
  };

  const getConditionLabel = (bmi) => {
    if (bmi < 18.5) return "Podváha";
    if (bmi >= 18.5 && bmi < 25) return "Ideální váha";
    if (bmi >= 25 && bmi < 30) return "Nadváha";
    if (bmi >= 30 && bmi < 35) return "Obezita I. stupně";
    if (bmi >= 35 && bmi < 40) return "Obezita II. stupně";
    if (bmi >= 40) return "Obezita III. stupně";
    return "Neznámý stav";
  };
  return (
    <>
      <div className="data-container">
        <h3>Informace:</h3>
        {update ? (
          <form onSubmit={handleSubmit} className="data-form">
            <div className="gender">
              <label htmlFor="gen">Pohlaví</label>
              <select
                id="gen"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={errors.gender ? "input-error" : ""}
              >
                <option value="">Vyberte...</option>
                <option value="0">Neurčeno</option>
                <option value="1">Muž</option>
                <option value="2">Žena</option>
              </select>
            </div>
            <div className="dob">
              <label htmlFor="dob">Datum narození</label>
              <input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className={errors.dateOfBirth ? "input-error" : ""}
              />
            </div>
            <div className="height-data">
              <label htmlFor="height">Výška</label>
              <input
                id="height"
                type="number"
                min="25"
                max="250"
                step="0.1"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className={errors.heightCm ? "input-error" : ""}
              />
              <span className="unit">[cm]</span>
            </div>
            <div className="weight-data">
              <label htmlFor="weight">Váha</label>
              <input
                id="weight"
                type="number"
                min="15"
                max="500"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className={errors.weightKg ? "input-error" : ""}
              />
              <span className="unit">[kg]</span>
            </div>
            <div className="activity-data">
              <label htmlFor="activity">Úroveň aktivity</label>
              <select
                id="activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className={errors.activityLevel ? "input-error" : ""}
              >
                <option value="">Vyberte...</option>
                <option value="0">Sedavý</option>
                <option value="1">Lehká aktivita</option>
                <option value="2">Střední aktivita</option>
                <option value="3">Aktivní</option>
                <option value="4">Velmi aktivní</option>
              </select>
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
            {userData ? (
              <>
                <div className="gender">
                  Pohlaví: {getGenderLabel(userData.gender)}
                </div>
                <div className="dob">Věk: {userData.age}</div>
                <div className="height-data">
                  Výška: {userData.heightCm} [cm]
                </div>
                <div className="weight-data">
                  Váha: {userData.weightKg} [kg]
                </div>
                <div className="activity-data">
                  Úroveň aktivity: {getActivityLabel(userData.activityLevel)}
                </div>
                <div className="bmi">
                  BMI: {userData.bmi}{" "}
                  <span className="condition-level">
                    {getConditionLabel(userData?.bmi)}
                  </span>
                </div>
                <div className="bmr">BMR: {userData.bmr}</div>
                <div className="tdee">TDEE: {userData.tdee}</div>
                <div className="info-container">
                  <div className="info-bmi">
                    Body Mass Index: Index tělesné hmotnosti - poměr váhy a
                    výšky
                  </div>
                  <div className="info-bmr">
                    Basal Metabolic Rate: Bazální metabolismus - kalorie které
                    tělo spálí v klidu
                  </div>
                  <div className="info-tdee">
                    Total Daily Energy Expenditure: Celkový denní energetický
                    výdej - kalorie spálené za den
                  </div>
                </div>
              </>
            ) : (
              <p>Data nebyla vyplněna.</p>
            )}
          </>
        )}
        <button
          type="button"
          className="button"
          onClick={handleUpdateBtn}
          disabled={loading}
        >
          {update ? "Zrušit" : "Upravit data"}
        </button>
        <PreviousBtn />
      </div>
    </>
  );
};

export default UserData;
