import "./MainPage.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const MainPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/jobs");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setJobPosts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosts();

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken.name.username);
      if (decodedToken && decodedToken.flag && decodedToken.flag.flag === "3") {
        setUserName(decodedToken.name.username);
      }
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="header">
        {userName ? (
          <Link to="/profile" className="user-info-link">
            <div className="user-info">
              <FontAwesomeIcon icon={faUser} /> <p>{userName}</p>
            </div>
          </Link>
        ) : (
          <div>
            <Link to="/login">
              <button className="auth-button">Login</button>
            </Link>
            <Link to="/register">
              <button className="auth-button">Register</button>
            </Link>
          </div>
        )}
      </div>
      {jobPosts.map((job) => (
        <div key={job.id} className="job-post">
          <Link to={{ pathname: `/job/${job.id}`, state: { job } }}>
            <h2>{job.name}</h2>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MainPage;
