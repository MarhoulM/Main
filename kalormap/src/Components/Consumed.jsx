import "./Consumed.css";
import useConsumed from "./useConsumed";
import { useDate } from "./DateContext";

const Consumed = () => {
  const { selectedDate } = useDate();
  const foods = useConsumed(selectedDate);
  return (
    <>
      <h3>Vaše jídla:</h3>
      <div className="consumed-container">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Jídlo</th>
                <th>Energie kcal</th>
                <th>Protein g</th>
                <th>Cukr g</th>
                <th>Tuk g</th>
                <th>Vláknina g</th>
                <th>Čas</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food.id}>
                  <td>{food.mealName || food.foodName}</td>
                  <td>{food.energy}</td>
                  <td>{food.protein}</td>
                  <td>{food.sugar}</td>
                  <td>{food.fat}</td>
                  <td>{food.fiber}</td>
                  <td>
                    {new Date(food.dateConsumed).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Consumed;
