import "./MainPage.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { faUser, faBuilding, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MainPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [cId, setCompanyId] = useState(null);

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

    const fetchJobPostsByCompanyId = async (companyId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/jobs/company/${companyId}`
        );
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

    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);

      const now = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < now) {
        localStorage.removeItem("token");
        fetchJobPosts();
      } else if (decodedToken) {
        if (decodedToken.flag === "3") {
          setUserName(decodedToken.name);
          fetchJobPosts();
        } else if (decodedToken.flag === "2") {
          setCompanyName(decodedToken.companyName);
          fetchJobPostsByCompanyId(decodedToken.companyId.id);
          setCompanyId(decodedToken.companyId.id);
        } else if (decodedToken.flag === "4") {
          setUserName(decodedToken.name);
          setCompanyName(decodedToken.companyName);
          fetchJobPostsByCompanyId(decodedToken.companyId.id);
          setCompanyId(decodedToken.companyId.id);
        }
        setLoading(false);
      }
    } else {
      fetchJobPosts();
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {userName && companyName ? (
        <div>
          <Link to="/profile" className="user-info-link">
            <div className="user-info">
              <FontAwesomeIcon icon={faUser} /> <p>{userName}</p>
            </div>
          </Link>
          <Link to="/company-profile" className="user-info-link">
            <div className="user-info">
              <FontAwesomeIcon icon={faBuilding} /> <p>{companyName}</p>
            </div>
          </Link>
        </div>
      ) : userName ? (
        <Link to="/profile" className="user-info-link">
          <div className="user-info">
            <FontAwesomeIcon icon={faUser} /> <p>{userName}</p>
          </div>
        </Link>
      ) : companyName ? (
        <div>
          <div className="user-info">
            <FontAwesomeIcon icon={faBuilding} /> <p>{companyName}</p>
          </div>
          <Link
            to={{ pathname: `/company/${cId}/createJob` }}
            className="user-info-link"
          >
            <button className="auth-button">
              <FontAwesomeIcon icon={faPlus} /> Add New Job
            </button>
          </Link>
        </div>
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
