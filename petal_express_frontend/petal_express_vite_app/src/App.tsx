import { Outlet } from "react-router-dom";
import Navigation from "./pages/Navigation";

import "./App.css";
const App = () => {
  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  );
};

export default App;