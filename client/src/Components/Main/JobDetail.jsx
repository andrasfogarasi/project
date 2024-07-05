import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./MainPage.css";

const JobDetail = () => {
  const location = useLocation();
  const { job: jobFromState } = location.state || {};
  const { jobId } = useParams();
  const [job, setJob] = useState(jobFromState);
  const [loading, setLoading] = useState(!jobFromState);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!job) {
      const fetchJob = async () => {
        try {
          const response = await fetch(`http://localhost:5000/jobs/${jobId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setJob(data[0]);
          } else {
            setError(new Error("Job not found"));
          }
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchJob();
    }
  }, [job, jobId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!job) return <div>Job not found</div>;

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`http://localhost:5000/application`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: formFields.field2,
          companyId: job.company_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <h1>{job.name}</h1>
      <h2>Company ID: {job.company_id}</h2>
      <p>Salary: {job.salary}</p>

      <form onSubmit={handleFormSubmit}>
        <br />
        <label>
          <textarea
            name="field2"
            rows="10"
            cols="50"
            placeholder="Write something:"
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default JobDetail;
