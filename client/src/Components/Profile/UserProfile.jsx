import "../Main/MainPage.css";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getTokenWithExpiry } from "../Functions/tokenUtils.js";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Age:", age);
    console.log("Experience:", experience);
  };

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(`http://localhost:5000/profile/${userId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setUserData(data[0]);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const token = getTokenWithExpiry("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken && decodedToken.flag) {
          setUserName(decodedToken.name);
          fetchUserData(decodedToken.id.id);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        setError(new Error("Invalid token"));
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError(new Error("No token found"));
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="header">
        <h1>Welcome, {userName}</h1>
        <Link to="/login" className="user-info-link">
          <div className="logout-button">
            <p>Logout</p>
          </div>
        </Link>
      </div>
      {userData && (
        <div>
          <p>
            <strong>First Name:</strong> {userData.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {userData.last_name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
        </div>
      )}

      <div>
        <h2>Update Your Information</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={handleAgeChange}
            />
          </div>
          <div>
            <label htmlFor="experience">Experience:</label>
            <input
              type="text"
              id="experience"
              value={experience}
              onChange={handleExperienceChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
