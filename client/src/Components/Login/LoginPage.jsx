import React, { useState, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import RegisterPage from "../Register/RegisterPage.jsx";
import { setTokenWithExpiry } from "../../Functions/tokenUtils.js";
import BasicHeader from "../Headers/BasicHeader.jsx";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginButton = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        const token = result.token;

        setTokenWithExpiry("token", token, 3600 * 1000);
        navigate("/");
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || "An unknown error occurred";
        console.error("Login failed:", errorMessage);
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="wrapper">
      <BasicHeader />
      <form onSubmit={handleLoginButton}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button id="loginButton" type="submit" onClick={handleLoginButton}>
          Login
        </button>

        <button className="register-link">
          <Link to="/register">Create new account</Link>
        </button>
      </form>

      <Routes>
        <Route path="register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
};

export default LoginPage;
