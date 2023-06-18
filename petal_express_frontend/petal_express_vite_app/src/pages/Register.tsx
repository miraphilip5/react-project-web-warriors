import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import decode from "jwt-decode";

import { SERVER_PORT } from "../config";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

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
      navigate('/login');
    } catch (e) {
      console.log("error ", e);
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      <p>Create Your Account</p>
      <form onSubmit={(e) => onSubmit(e)}>
        <div>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength={6}
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={(e) => onChange(e)}
            minLength={6}
          />
        </div>
        <input type="submit" value="Register" />
      </form>
      <p>
        Already have an account? <NavLink to="/login">Sign In</NavLink>
      </p>
    </>
  );
};

export default Register;
