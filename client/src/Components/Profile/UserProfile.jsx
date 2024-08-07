import "../Main/MainPage.css";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getTokenWithExpiry } from "../../Functions/tokenUtils.js";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import ProfileHeader from "../Headers/ProfileHeader.jsx";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [languageName, setLanguageName] = useState(null);
  const [universityName, setuniversityName] = useState(null);

  const [formData, setFormData] = useState({
    universityId: "",
    birthdayDate: "",
    languageId: "",
    presentation: "",
    userId: 0,
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
        setUserData(data[0]);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStudentData = async (userId) => {
      try {
        const response = await fetch(`http://localhost:5000/student/${userId}`);
        if (!response.ok) {
          setStudentData(null);
        } else {
          const data = await response.json();
          console.log(data);

          setStudentData(data.student);
          setLanguageName(data.language.language_name);
          setuniversityName(data.university.university_name);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUniversities = async () => {
      try {
        const response = await fetch("http://localhost:5000/university");
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
        const response = await fetch("http://localhost:5000/language");
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
          fetchStudentData(decodedToken.id.id);
          fetchUniversities();
          fetchLanguages();
          setUserId(decodedToken.id.id);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    if (userId) {
      setFormData((prevData) => ({
        ...prevData,
        userId: userId,
      }));
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Inserting failed:", response.statusText);
        alert("Error");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!hasAccess) return <NotFoundPage />;

  return (
    <div>
      <ProfileHeader />
      <div className="profile-data">
        <h1>{userName}</h1>
      </div>
      {userData && (
        <div className="profile-data">
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

      {studentData ? (
        <div>
          <p>
            <strong>Birthday date:</strong> {studentData.birthday_data}
          </p>
          <p>
            <strong>Presentation:</strong> {studentData.presentation}
          </p>
          {universityName ? (
            <p>
              <strong>University:</strong> {universityName}
            </p>
          ) : null}
          {languageName ? (
            <p>
              <strong>Mother tongue:</strong> {languageName}
            </p>
          ) : null}
        </div>
      ) : (
        <div>
          <h2>Update Your Information</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="birthdayDate">Birth Date:</label>
              <input
                type="date"
                id="birthdayDate"
                name="birthdayDate"
                value={formData.birthdayDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <select
                name="languageId"
                value={formData.languageId}
                onChange={handleChange}
                required
              >
                <option value="">Select mother tongue</option>
                {languages.map((language) => (
                  <option
                    key={language.language_id}
                    value={language.language_id}
                  >
                    {language.language_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="presentation">Presentation:</label>
              <input
                type="text"
                id="presentation"
                name="presentation"
                value={formData.presentation}
                onChange={handleChange}
              />
            </div>
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
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
