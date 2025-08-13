import "./ProgressBar.css";

const ProgressBar = ({
  label,
  value,
  color,
  currentNutrition,
  targetNutrition,
}) => {
  return (
    <div className="progress-item">
      <label>{label}</label>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${value}%`, backgroundColor: color }}
        ></div>
        <span className="progress-text">{value} %</span>
      </div>
      <div className="progress-info">
        <span className="ratio">
          {currentNutrition}/{targetNutrition}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
