import { useNavigate } from "react-router-dom";

const PreviousBtn = () => {
  const navigate = useNavigate();
  const handlePreviousClick = () => {
    navigate(-1);
  };
  return (
    <>
      <button className="button" onClick={handlePreviousClick}>
        Zpět
      </button>
    </>
  );
};
export default PreviousBtn;
