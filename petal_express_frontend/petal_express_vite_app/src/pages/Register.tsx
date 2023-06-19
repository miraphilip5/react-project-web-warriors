import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import decode from "jwt-decode";

import { SERVER_PORT } from "../config";

// imports for mui
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
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

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setValidationError("");

    if (password.length < 6) {
      setValidationError("Password should be at least 6 characters long.");
      return;
    }
    if (password !== password2) {
      setValidationError("Passwords do not match!");
      return;
    }

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
        `http://localhost:${SERVER_PORT}/api/user`,
        data,
        config
      );
      localStorage.setItem("token", response.data.token);
      let decodeddata = decode(response.data.token);
      console.log(decodeddata);
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
          <Box component="form" onSubmit={(e) => onSubmit(e)} sx={{ mt: 3 }}>
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  placeholder="Password"
                  name="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => onChange(e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  // minLength={6}
                  value={password2}
                  onChange={(e) => onChange(e)}
                  fullWidth
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
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
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
