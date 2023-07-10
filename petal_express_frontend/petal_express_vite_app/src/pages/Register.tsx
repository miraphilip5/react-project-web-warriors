import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import decode from "jwt-decode";

import { SERVER_PORT } from "../config";

// imports for mui
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [validationError, setValidationError] = useState("");

  const { name, email, password, password2 } = formData;

  const onChange = (e : any) => {
    setValidationError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });

    //why use validation inside useEffect and not here?
    //its because setFormData is asynchronous which only gets updated after the end of onChange function execution
    // this means if password is 123456, formData.password stores 12345 (not the latest value)
    //useEffect solves this by getting the latest state
  };

  useEffect(() => {
    console.log(password);
    console.log(password2);
    if (password && password.length < 6) {
      setValidationError("Password should be at least 6 characters long!");
      return;
    }else if(password2 !== password){
      setValidationError("Passwords must match!");
    }else{
      setValidationError("");
    }
  },[name,email,password,password2]);

  const onSubmit = async (e : any) => {
    e.preventDefault();
    
    //don't let the user submit the registration form if there is any validation error
    if (validationError!=="") {return};

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let data = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${SERVER_PORT}/api/user`,
        data,
        config
      );
      localStorage.setItem("token", response.data.token);
      let decodeddata = decode(response.data.token);
      console.log(decodeddata);
      //Store something in localstorage so that we can use it in the login page to indicate successful registration
      localStorage.setItem("isJustRegistered", "true");
      // Redirect to '/flowers' after successful registration
      navigate("/login");
    } catch (e) {
      console.log("error ", e);
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="text"
                  label="Name"
                  name="name"
                  value={name}
                  onChange={(e) => onChange(e)}
                  required
                  autoFocus
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={(e) => onChange(e)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => onChange(e)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  value={password2}
                  onChange={(e) => onChange(e)}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            {validationError && (
              <Typography variant="body2" color="error" align="center">
                {validationError}
              </Typography>
            )}
            <Button
              type="submit"
              onSubmit={(e) => onSubmit(e)}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#9C27B0' }}
            >
              Sign Up
            </Button>
          </Box>
          <p>
            Already have an account? <NavLink to="/login">Sign In</NavLink>
          </p>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
