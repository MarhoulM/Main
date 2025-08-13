import useNutrition from "./useNutrition";
import "./Stats.css";
import ProgressBar from "./ProgressBar";

const Stats = ({ selectedDate }) => {
  const { summary } = useNutrition(selectedDate);
  return (
    <>
      <ProgressBar
        label="Energie"
        value={summary?.progressCalories}
        currentNutrition={summary?.totalCalories}
        targetNutrition={summary?.goalCalories}
        color="#4e79a7"
      />
      <ProgressBar
        label="Protein"
        value={summary?.progressProtein}
        currentNutrition={summary?.totalProtein}
        targetNutrition={summary?.goalProtein}
        color="#f28e2b"
      />
      <ProgressBar
        label="Cukr"
        value={summary?.progressCarbohydrate}
        currentNutrition={summary?.totalCarbohydrate}
        targetNutrition={summary?.goalCarbohydrate}
        color="#e15759"
      />
      <ProgressBar
        label="Tuk"
        value={summary?.progressFat}
        currentNutrition={summary?.totalFat}
        targetNutrition={summary?.goalFat}
        color="#76b7b2"
      />
      <ProgressBar
        label="Vláknina"
        value={summary?.progressFiber}
        currentNutrition={summary?.totalFiber}
        targetNutrition={summary?.goalFiber}
        color="#edc948"
      />
    </>
  );
};
export default Stats;
