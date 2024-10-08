import "../Main/MainPage.css";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import { useParams } from "react-router-dom";
import BannedPage from "../Error/BannedPage.jsx";
import Header from "../Headers/Header.jsx";

const ViewUserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [banned, setBanned] = useState(false);
  const [universityName, setuniversityName] = useState(null);
  const [courseName, setCourseName] = useState(null);
  const [spokenLanguages, setspokenLanguages] = useState([]);
  const { profileId } = useParams();

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

    const fetchSpokenLanguages = async (studentId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/spoken_language/${studentId}`
        );

        if (response.ok) {
          const data = await response.json();
          setspokenLanguages(data);
        }
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
          let data = await response.json();

          if (data.student && data.university) {
            setStudentData(data.student[0]);
            setCourseName(data.student.university_course);
            setuniversityName(data.university.university_name);
            fetchSpokenLanguages(data.student.id);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken && decodedToken.flag) {
          if (decodedToken.banned) {
            setBanned(true);
          } else {
            setHasAccess(true);
            setUserName(decodedToken.name);
            fetchUserData(profileId);
            fetchStudentData(profileId);
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
  }, [profileId]);

  async function downloadCV(filename) {
    try {
      const response = await fetch(
        `http://localhost:5000/student/download-cv/${filename}`
      );
      if (!response.ok) {
        throw new Error("Failed to download the CV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Your_Current_CV.pdf");

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the CV:", error);
    }
  }

  if (banned) return <BannedPage />;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!hasAccess) return <NotFoundPage />;

  return (
    <div>
      <Header />

      {userData && (
        <div className="job-post">
          <h1>{userName}</h1>
          <h2>First name: {userData.first_name}</h2>
          <h2>Last name: {userData.last_name}</h2>
          <h3>Email: {userData.email}</h3>

          {studentData ?? (
            <div>
              <h3>Presentation: {userData.presentation}</h3>

              {universityName && <h3>University: {universityName}</h3>}
              {courseName ? <h3>University programme: {courseName}</h3> : null}

              <h2>Known languages</h2>
              <h3>
                {spokenLanguages.map((language) => (
                  <option
                    key={language.language_id}
                    value={language.language_id}
                  >
                    {language.language_name}
                  </option>
                ))}
              </h3>

              {studentData && studentData.cv_filename ? (
                <div className="download-existing-cv">
                  <button onClick={() => downloadCV(studentData.cv_filename)}>
                    Download Your CV
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewUserProfile;
