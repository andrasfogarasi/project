import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import Header from "../Headers/Header.jsx";

const SendProblem = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    userId: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < now) {
        localStorage.removeItem("token");
      } else if (decodedToken) {
        if (decodedToken.flag === "3") {
          setUserId(decodedToken.id.id);
          setHasAccess(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      setFormData((prevData) => ({
        ...prevData,
        userId: userId,
      }));
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        navigate("/profile");
      } else {
        console.error("Create new job failed:", response.statusText);
        alert("Error");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  if (!hasAccess) return <NotFoundPage />;

  return (
    <div className="wrapper">
      <Header />
      <h1>Send a report!</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <textarea
            placeholder="Write!"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            cols="40"
          />
        </div>
        <button type="submit">Send!</button>
      </form>
    </div>
  );
};

export default SendProblem;
