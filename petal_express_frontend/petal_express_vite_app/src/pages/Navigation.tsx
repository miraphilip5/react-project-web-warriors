import { NavLink, useNavigate } from "react-router-dom";

// mui imports
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";

const StyledNavLink = styled(NavLink)`
  color: white;
  margin-right: 30px;
  text-decoration: none;
  &.active {
    font-weight: bold;
  }
`;

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic and remove the token from local storage
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#9c27b0" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, textAlign: "left" }}
        >
          Petal Express
        </Typography>
        <nav>
            <>
              <StyledNavLink to="/flowers">Home</StyledNavLink>
              <StyledNavLink to="/orders">Orders</StyledNavLink>
              <StyledNavLink to="/cart">My Cart</StyledNavLink>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  marginLeft: "10px",
                  fontWeight: "bold",
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "maroon",
                    color: "white",
                  },
                }}
              >
                Logout
              </Button>
            </>
        </nav>
      </Toolbar>
    </AppBar>
  );
};
export default Navigation;
