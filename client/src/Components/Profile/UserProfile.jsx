import "../Main/MainPage.css";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getTokenWithExpiry } from "../Functions/tokenUtils.js";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);

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
        console.log(decodedToken.name.username);

        if (decodedToken && decodedToken.flag) {
          setUserName(decodedToken.name.username);
          fetchUserData(decodedToken.userId.id);
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
      <h1>Welcome, {userName}</h1>
      {userData && (
        <div>
          <h2>Your Profile</h2>
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Username:</strong> {userData.username}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
