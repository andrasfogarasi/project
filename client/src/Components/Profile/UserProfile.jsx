import "./Profile.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getTokenWithExpiry } from "../../Functions/tokenUtils.js";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import ProfileHeader from "../Headers/ProfileHeader.jsx";
import BannedPage from "../Error/BannedPage.jsx";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [banned, setBanned] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [courseName, setCourseName] = useState(null);
  const [universityName, setuniversityName] = useState(null);
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    universityId: "",
    birthdayDate: "",
    universityCourse: "",
    presentation: "",
    userId: 0,
  });

  const [languageFormData, setLanguageFormData] = useState({
    languageId: "",
  });

  const handleLanguageChange = (e) => {
    setLanguageFormData({
      ...languageFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

          setStudentData(data.student);
          setStudentId(data.student.id);
          setCourseName(data.student.university_course);
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

        if (decodedToken && decodedToken.flag) {
          if (decodedToken.banned) {
            setBanned(true);
          } else {
            if (decodedToken.flag === "3") {
              setHasAccess(true);
              setUserName(decodedToken.name);
              fetchUserData(decodedToken.id.id);
              fetchStudentData(decodedToken.id.id);
              fetchUniversities();
              fetchLanguages();
              setUserId(decodedToken.id.id);
            }

            if (decodedToken.flag === "1") {
              setHasAccess(true);
              setIsAdmin(true);
              setUserName("Admin");
              setUserId(decodedToken.id.id);
              setLoading(false);
            }
          }
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

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/student/upload/${studentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        window.location.reload();
      } else {
        console.error("Error:", res.data);
      }
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
    }
  };

  const handleLanguageSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://yourserver.com/api/language",
        formData
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDeleteButton = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        localStorage.clear();
        navigate("/");
      } else {
        console.error("Login failed:", response.statusText);
        alert("Error");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

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
      <ProfileHeader />

      {isAdmin ? (
        <>
          <p>Admin Page</p>

          <Link to="/admin/user">
            <button className="register-link">View users</button>
          </Link>
          <Link to="/admin/company">
            <button className="register-link">View companies</button>
          </Link>
          <Link to="/admin/problem">
            <button className="register-link">View reports</button>
          </Link>
          <Link to="/admin/department">
            <button className="register-link">Add new department</button>
          </Link>
          <Link to="/admin/addAccess">
            <button className="register-link">Add access for companies</button>
          </Link>
        </>
      ) : (
        <>
          {userData && (
            <div className="job-post">
              <h1>{userName}</h1>
              <h2>First name: {userData.first_name}</h2>
              <h2>Last name: {userData.last_name}</h2>
              <h3>Last name: {userData.email}</h3>

              {studentData ? (
                <>
                  <div>
                    {universityName ? (
                      <h3>University: {universityName}</h3>
                    ) : null}

                    {courseName ? (
                      <h3>University programme: {courseName}</h3>
                    ) : null}
                  </div>

                  {!studentData.cv_filename ? (
                    <>
                      <h2>Upload Your CV</h2>
                      <form onSubmit={handleFileSubmit}>
                        <div>
                          <label htmlFor="document">Upload PDF:</label>
                          <input
                            type="file"
                            id="document"
                            name="document"
                            accept=".pdf"
                            onChange={handleFileChange}
                            required
                          />
                        </div>
                        <button type="submit">Upload</button>
                      </form>

                      <br />
                      <div className="download-template">
                        <a href="/cv-template.pdf" download="CV_Template.pdf">
                          Download CV Template
                        </a>
                      </div>

                      <h2>Add a language</h2>
                      <form onSubmit={handleFileSubmit}>
                        <div className="input-box">
                          <select
                            name="languageId"
                            value={formData.languageId}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select language</option>
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
                        <button type="submit">Add</button>
                      </form>
                    </>
                  ) : (
                    <div className="download-existing-cv">
                      <button
                        onClick={() => downloadCV(studentData.cv_filename)}
                      >
                        Download Your CV
                      </button>
                    </div>
                  )}

                  <Link to="/application">
                    <button className="register-link">My Applications</button>
                  </Link>
                </>
              ) : (
                <div class="form-container">
                  <div class="form-section">
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
                      <div>
                        <label htmlFor="presentation">Presentation:</label>
                        <textarea
                          id="presentation"
                          name="presentation"
                          value={formData.presentation}
                          onChange={handleChange}
                          rows="4"
                          cols="26"
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
                      <div>
                        <label htmlFor="universityCourse">
                          University programme:
                        </label>
                        <input
                          type="text"
                          id="universityCourse"
                          name="universityCourse"
                          value={formData.universityCourse}
                          onChange={handleChange}
                        />
                      </div>
                      <button type="submit">Submit</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          <Link to="/report">
            <button className="register-link">Send Report</button>
          </Link>

          <Link to="/application">
            <button className="register-link">View applications</button>
          </Link>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete?")) {
                handleDeleteButton();
              }
            }}
            className="delete-button"
          >
            <FontAwesomeIcon icon={faTrash} /> Delete User
          </button>
        </>
      )}
    </div>
  );
};

export default UserProfile;
