import "../Main/MainPage.css";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getTokenWithExpiry } from "../../Functions/tokenUtils.js";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import { useParams } from "react-router-dom";
import BannedPage from "../Error/BannedPage.jsx";

const ViewUserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [banned, setBanned] = useState(false);
  const [languageName, setLanguageName] = useState(null);
  const [universityName, setuniversityName] = useState(null);
  const { id } = useParams();

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

          if (data.student && data.language && data.university) {
            setStudentData(data.student);
            setLanguageName(data.language.language_name);
            setuniversityName(data.university.university_name);
          }
        }
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
          if (decodedToken.banned) {
            setBanned(true);
          } else {
            setHasAccess(true);
            setUserName(decodedToken.name);
            fetchUserData(id);
            fetchStudentData(id);
          }
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
  }, [id]);

  if (banned) return <BannedPage />;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!hasAccess) return <NotFoundPage />;

  return (
    <div>
      <div className="header">
        <h1>{userName}</h1>
      </div>

      {userData && (
        <div className="job-post">
          <h1>{userName}</h1>
          <h2>First name: {userData.first_name}</h2>
          <h2>Last name: {userData.last_name}</h2>
          <h3>Email: {userData.email}</h3>

          {studentData && (
            <div>
              <h3>Presentation: {userData.presentation}</h3>

              {universityName && <h3>University: {universityName}</h3>}

              {languageName && <h3>Mother tongue: {languageName}</h3>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewUserProfile;
