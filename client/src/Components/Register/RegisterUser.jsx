import React, { useState, useEffect } from "react";
import { setTokenWithExpiry } from "../../Functions/tokenUtils.js";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import BasicHeader from "../Headers/BasicHeader.jsx";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
    flag: 3,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/register", {
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
        console.error("Register failed:", errorMessage);
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="wrapper">
      <BasicHeader />
      <h1>Register User</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
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
            type="text"
            placeholder="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            placeholder="Last Name"
            name="lastname"
            value={formData.lastname}
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
        <div className="input-box">
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterUser;
