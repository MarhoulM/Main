import useNutrition from "./useNutrition";
import "./Overview.css";
const BASE_URL = import.meta.env.VITE_APP_API_URL;

const Overview = ({ selectedDate }) => {
  const { summary } = useNutrition(selectedDate);
  return (
    <>
      <div className="overview-container">
        <div className="radial-chart">
          <div className="circle circle0"></div>
          <div
            className="circle circle1"
            style={{
              background:
                summary?.progressCalories > 100
                  ? `conic-gradient(#ff0000 0% 100%, #b80202ff 100% 100%)`
                  : `conic-gradient(#4e79a7 0% ${
                      summary?.progressCalories || 0
                    }%, #414040ff ${summary?.progressCalories || 0}% 100%)`,
            }}
          ></div>
          <div
            className="circle circle2"
            style={{
              background:
                summary?.progressProtein > 100
                  ? `conic-gradient(#ff0000 0% 100%, #b80202ff 100% 100%)`
                  : `conic-gradient(#f28e2b 0% ${
                      summary?.progressProtein || 0
                    }%, #414040ff ${summary?.progressProtein || 0}% 100%)`,
            }}
          ></div>
          <div
            className="circle circle3"
            style={{
              background:
                summary?.progressCarbohydrate > 100
                  ? `conic-gradient(#ff0000 0% 100%, #b80202ff 100% 100%)`
                  : `conic-gradient(#e15759 0% ${
                      summary?.progressCarbohydrate || 0
                    }%, #414040ff ${summary?.progressCarbohydrate || 0}% 100%)`,
            }}
          ></div>
          <div
            className="circle circle4"
            style={{
              background:
                summary?.progressFat > 100
                  ? `conic-gradient(#ff0000 0% 100%, #b80202ff 100% 100%)`
                  : `conic-gradient(#76b7b2 0% ${
                      summary?.progressFat || 0
                    }%, #414040ff ${summary?.progressFat || 0}% 100%)`,
            }}
          ></div>
          <div
            className="circle circle5"
            style={{
              background:
                summary?.progressFiber > 100
                  ? `conic-gradient(#ff0000 0% 100%, #b80202ff 100% 100%)`
                  : `conic-gradient(#edc948 0% ${
                      summary?.progressFiber || 0
                    }%, #414040ff ${summary?.progressFiber || 0}% 100%)`,
            }}
          ></div>
          <div className="center-label">
            {" "}
            {summary
              ? `${Math.round(summary.progressCalories)}%`
              : "Načítám..."}
          </div>
        </div>
        <div className="legend">
          <div className="legend-item">
            <span className="c1"></span>
            <div className="energy">
              Energie: {summary?.progressCalories?.toFixed(2)}%
            </div>
          </div>
          <div className="legend-item">
            <span className="c2"></span>
            <div className="protein">
              Protein: {summary?.progressProtein?.toFixed(2)}%
            </div>
          </div>
          <div className="legend-item">
            <span className="c3"></span>
            <div className="sugar">
              Cukr: {summary?.progressCarbohydrate?.toFixed(2)}%
            </div>
          </div>
          <div className="legend-item">
            <span className="c4"></span>
            <div className="fat">Tuk: {summary?.progressFat?.toFixed(2)}%</div>
          </div>
          <div className="legend-item">
            <span className="c5"></span>
            <div className="fiber">
              Vláknina: {summary?.progressFiber?.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
