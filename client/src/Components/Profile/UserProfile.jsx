import "../Main/MainPage.css";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getTokenWithExpiry } from "../Functions/tokenUtils.js";
import { Link } from "react-router-dom";
import NotFoundPage from "../Error/NotFoundPage.jsx";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [formData, setFormData] = useState({
    universityId: "",
    birthdayDate: "",
    languageId: "",
    presentation: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

    const fetchUniversities = async () => {
      try {
        const response = await fetch("http://localhost:5000/universities");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setUniversities(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await fetch("http://localhost:5000/universities");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setLanguages(data);
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

        if (decodedToken && decodedToken.flag && decodedToken.flag === "3") {
          setHasAccess(true);
          setUserName(decodedToken.name);
          fetchUserData(decodedToken.id.id);
          fetchUniversities();
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
  if (!hasAccess) return <NotFoundPage />;

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
          <div className="input-box">
            <select
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
              required
            >
              <option value="">Select University</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.university_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="birthDate">Birth Date:</label>
            <input
              type="date"
              id="birthdayDate"
              value={formData.birthdayDate}
              onChange={handleChange}
            />
          </div>
          <div className="input-box">
            <select
              name="universityId"
              value={formData.languageId}
              onChange={handleChange}
              required
            >
              <option value="">Select mother tongue</option>
              {universities.map((language) => (
                <option key={language.language_id} value={language.language_id}>
                  {language.language_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="presentation">Experience:</label>
            <input
              type="text"
              id="presentation"
              value={formData.presentation}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
