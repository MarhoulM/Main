import { useState } from "react";
import Overview from "./Overview";
import Stats from "./Stats";
import "./Content.css";
import { useDate } from "./DateContext";

const Content = () => {
  const [state, setState] = useState(false);
  const { selectedDate } = useDate();
  const contentChange = () => {
    setState(!state);
  };
  return (
    <>
      <div className="stat-container">
        {state ? (
          <Stats selectedDate={selectedDate} />
        ) : (
          <Overview selectedDate={selectedDate} />
        )}
        <button className="btn-main" type="button" onClick={contentChange}>
          {state ? "Přehled" : "Detail"}
        </button>
      </div>
    </>
  );
};

export default Content;
