import { NavLink, useNavigate } from "react-router-dom";
const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic and remove the token from local storage
    localStorage.removeItem("token");
    navigate("/login");
  };

  // stores true if jwt exists else false (!! = converts to boolean)
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/orders">Orders</NavLink>
              <NavLink to="/cart">My Cart</NavLink>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
            </>
          )}
        </li>
        <li>{/* <NavLink to="/flowers">Flowers</NavLink> */}</li>
      </ul>
    </nav>
  );
};
export default Navigation;
