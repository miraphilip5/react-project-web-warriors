import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_PORT } from "../config";

const Login = () => {

  const navigate = useNavigate();

  //state variables for form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>  setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {

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
      navigate('/flowers');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1>Sign In</h1>
      <p>Sign Into Your Account</p>
      <form onSubmit={(e) => onSubmit(e)}>
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
        <input type="submit" value="Login" />
      </form>
      <p>
        <NavLink to="/register">Register</NavLink>
      </p>
    </>
  );
};

export default Login;
