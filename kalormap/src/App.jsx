import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./Components/AuthContext";
import Navbar from "./Components/Navbar";
import Consumed from "./Components/Consumed";
import Content from "./Components/Content";
import Profile from "./Components/Profile";
import Goal from "./Components/Goal";
import Food from "./Components/Food";
import Meal from "./Components/Meal";
import { DateContext } from "./Components/DateContext";

function App() {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  return (
    <>
      <AuthProvider>
        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
          <Router>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <div className="content-container">
                    <Content />
                    <Consumed />
                  </div>
                }
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/goal" element={<Goal />} />
              <Route path="/food" element={<Food />} />
              <Route path="/meal" element={<Meal />} />
            </Routes>
          </Router>
        </DateContext.Provider>
      </AuthProvider>
    </>
  );
}

export default App;
