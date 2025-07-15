import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleResetPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Enter your email address",
      inputPlaceholder: "your@email.com",
      showCancelButton: true,
      confirmButtonText: "Send Reset Link",
      inputValidator: (value) => {
        if (!value) return "Email is required!";
      },
    });

    if (email) {
      try {
        const response = await axios.put(
          "http://localhost:5000/user/api/reset-password",
          { email }
        );
        Swal.fire("Sent!", response.data.message, "success");
      } catch (error) {
        console.error(error);
        const msg =
          error?.response?.data?.message ||
          "Something went wrong, try again later.";
        Swal.fire("Error", msg, "error");
      }
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="funnc-nav">
        <h1>Awa</h1>
      </div>
      <div className="user-logo" ref={dropdownRef}>
        <button onClick={toggleMenu}>User</button>
        {menuOpen && (
          <div className="dropdown">
            <button onClick={handleResetPassword}>Reset Password</button>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
