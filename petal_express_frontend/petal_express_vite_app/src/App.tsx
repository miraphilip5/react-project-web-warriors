import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "./pages/Navigation";
import Footer from "./pages/Footer";

import "./App.css";
const App = () => {

  // to hide the navigation pane when the page is Login
  const location = useLocation();

  const navigate = useNavigate();

  // Check if the current route is "/login" or "/register"
  const hideNavigation = location.pathname === "/login" || location.pathname === "/register";

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {

    // stores true if jwt exists else false (!! = converts to boolean)
    const isLoggedIn = !!localStorage.getItem("token");

    if (!isLoggedIn && location.pathname !== "/login" && location.pathname !== "/register") {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [location, navigate]);

  if (isLoading) {
    return null; 
  }

  return (
    <div>
      {!hideNavigation && <Navigation />}
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
