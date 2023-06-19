import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_PORT } from "../config";

// mui libraries
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Login = () => {
  const navigate = useNavigate();

  //state variables for form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: any) => {
    e.preventDefault();

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let data = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `http://localhost:${SERVER_PORT}/api/auth`,
        data,
        config
      );
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      //console.log(decode(response.data.token));
      navigate("/flowers");
    } catch (e) {
      console.log(e);
    }
  };

  const defaultTheme = createTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
        <Typography sx= {{m:2}} component="h1" variant="h5">Sign In to Petal Express</Typography>
        {/* <p>Sign Into Your Account</p> */}
        <form onSubmit={(e) => onSubmit(e)}>
          <div>
            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              autoFocus
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div>
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              placeholder="Password"
              name="password"
              // minLength={6}
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <Button
              // value="Login"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
        </form>
        <p>
          <NavLink to="/register">Register</NavLink>
        </p>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
