// JobDetails.js
import React from "react";
import { useParams } from "react-router-dom";
import { jobPosts } from "./data";

const JobDetails = () => {
  const { id } = useParams();
  console.log("Job ID from params:", id);
  const job = jobPosts.find((job) => job.id === parseInt(id, 10));

  if (!job) {
    return <p>Job not found</p>;
  }

  return (
    <div>
      <h1>{job.title}</h1>
      <h3>{job.company}</h3>
      <p>{job.description}</p>
    </div>
  );
};

export default JobDetails;
