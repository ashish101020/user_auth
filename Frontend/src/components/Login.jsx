import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const validateInput = (username, password) => {
    return username && username.trim() !== "" && password && password.trim() !== "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput(formData.username, formData.password)) {
      alert("Invalid Credentials");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/user/api/authenticate", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 403) {
        alert("Account not verified");
      } else if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <div className="box">
        <form onSubmit={handleSubmit}>
          <div className="input-item">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />
          </div>
          <div className="input-item">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <button type="submit">LogIn</button>
        </form>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
