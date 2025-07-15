import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './Register.css'

const Register = () => {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !validateInput(
        formData.name,
        formData.username,
        formData.email,
        formData.password
      )
    ) {
      alert("Invalid Inputs");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/user/api/register",
        {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );
      formData.name = "";
      formData.username = "";
      formData.email = "";
      formData.password = "";
      alert(response.data.message);
    } catch (e) {
      alert("err");
      console.log(e);
    }
  };

  const validateInput = (name, username, email, password) => {
    return (
      name &&
      name.trim() !== "" &&
      username &&
      username.trim() !== "" &&
      email &&
      email.trim() !== "" &&
      password &&
      password.trim() !== ""
    );
  };

  return (
    <div className="register-page">
      <div className="box">
        <form onSubmit={handleSubmit}>
          <div className="input-item">
            <input
              type="text"
              value={formData.name}
              name="name"
              onChange={(e) => handleChange(e)}
              required
              placeholder="Name"
            />
          </div>
          <div className="input-item">
            <input
              type="text"
              value={formData.username}
              name="username"
              onChange={(e) => handleChange(e)}
              required
              placeholder="Username"
            />
          </div>
          <div className="input-item">
            <input
              type="text"
              value={formData.email}
              name="email"
              onChange={(e) => handleChange(e)}
              required
              placeholder="Email"
            />
          </div>
          <div className="input-item">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange(e)}
              required
              placeholder="Password"
            />
          </div>
          <br />
          <button type="submit">Sugn Up</button>
        </form>
        <p>Have account <Link to="/">LogIn</Link></p>
      </div>
    </div>
  );
};

export default Register;
