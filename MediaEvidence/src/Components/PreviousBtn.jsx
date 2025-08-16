import { useNavigate } from "react-router-dom";
import "./PreviousBtn.css";

const PreviousBtn = () => {
  const navigate = useNavigate();
  const handlePreviousClick = () => {
    navigate(-1);
  };
  return (
    <>
      <button className="previous-button" onClick={handlePreviousClick}>
        Zpět
      </button>
    </>
  );
};
export default PreviousBtn;
