import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import './Login.css';
import { AuthContext } from "../context/AuthContext";

const Login = () => {

  const { login, loading } = useContext(AuthContext);

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

    login(formData);
    
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
              required
              placeholder="Username"
            />
          </div>
          <div className="input-item">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
            />
          </div>
          <button type="submit">{loading ? "Logging..." : "LogIn"}</button>
        </form>
        <p>Don't have account  <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
