import "./MainPage.css";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const UserProfile = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchJobPosts = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          console.log(decodedToken.name.username);

          if (decodedToken) {
            setUserName(decodedToken.name.username);
            fetchJobPosts(decodedToken.userId.id); //
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      } else {
        setLoading(false);
        setError(new Error("No token found"));
      }

      try {
        const response = await fetch("http://localhost:5000/profile/");
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
      {userName && (
        <Link to="/profile" className="user-info-link">
          <div className="user-info">
            <FontAwesomeIcon icon={faUser} /> <p>{userName}</p>
          </div>
        </Link>
      )}
      {jobPosts.map((job) => (
        <div key={job.id} className="job-post">
          <Link to={{ pathname: `/job/${job.id}`, state: { job } }}>
            <h2>{job.name}</h2>
          </Link>
          <h3>{job.company_id}</h3>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
