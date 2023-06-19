import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./pages/Navigation";

import "./App.css";
const App = () => {

  // to hide the navigation pane when the page is Login
  const location = useLocation();
  // Check if the current route is "/login"
  const hideNavigation = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {!hideNavigation && <Navigation />}
      <Outlet />
    </div>
  );
};

export default App;
