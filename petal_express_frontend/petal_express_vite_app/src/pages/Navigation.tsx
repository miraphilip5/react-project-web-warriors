import { NavLink } from "react-router-dom";
const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Petal Express Home</NavLink>
        </li>
        <li>
          {/* <NavLink to="/flowers">Flowers</NavLink> */}
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;