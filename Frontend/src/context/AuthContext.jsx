import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {api} from '../api/config'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check token and fetch user on first load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get(
            `${api}/user/api/authenticate`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          setUser(res.data.user); // Assuming response has { user: {...} }
        } catch (err) {
          console.error("Auto-login failed:", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    };

    fetchUser();
  }, []);

  const login = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${api}/user/api/authenticate`,
        {
          username: formData.username,
          password: formData.password,
        }
      );
      setLoading(false);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        navigate("/dashboard");
      } else if (response.status === 403) {
        alert("Account not verified");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Login failed. Please check your credentials.");
    }
  };


  const logout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
