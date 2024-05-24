import React from "react";
import "./MainPage.css";
import { jobPosts } from "./data";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="dashboard">
      <div>
        {jobPosts.map((job) => (
          <div key={job.id} className="job-post">
            <Link to={`/jobs/${job.id}`}>
              <h2>{job.title}</h2>
            </Link>
            <h3>{job.company}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
