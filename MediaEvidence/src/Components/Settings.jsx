import PreviousBtn from "./PreviousBtn";
import "./Settings.css";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/add");
  };
  const handleUpdate = () => {
    navigate("/update");
  };
  const handleDelete = () => {
    navigate("/delete");
  };
  return (
    <>
      <div className="operations">
        <h2>Správce evidence </h2>
        <p>Jakou operaci chcete provést?</p>
        <div className="add-product">
          <button className="add-button" onClick={handleAdd}>
            Přidat
          </button>
        </div>
        <div className="update-product">
          <button className="update-button" onClick={handleUpdate}>
            Upravit
          </button>
        </div>
        <div className="delete-product">
          <button className="delete-button" onClick={handleDelete}>
            Smazat
          </button>
        </div>
        <PreviousBtn />
      </div>
    </>
  );
};

export default Settings;
