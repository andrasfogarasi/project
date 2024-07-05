import "./MainPage.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MainPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
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

export default MainPage;
