import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Header from "../Headers/Header.jsx";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import BannedPage from "../Error/BannedPage.jsx";

const MyApplications = () => {
  const location = useLocation();
  const { job: jobFromState } = location.state || {};
  const { jobId } = useParams();
  const [job, setJob] = useState(jobFromState);
  const [loading, setLoading] = useState(!jobFromState);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [banned, setBanned] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentId = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/student/id/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setStudentId(data[0].id);
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
            if (decodedToken.flag === "3") {
              setHasAccess(true);
              setUserName(decodedToken.name);
              fetchStudentId(decodedToken.id.id);
              setUserId(decodedToken.id.id);
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
  }, []);

  useEffect(() => {
    const fetchJob = async (studentId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/application/job/${studentId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.length > 0) {
          setJob(data);
        } else {
          setError(new Error("Job not found"));
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchJob(studentId);
    }
  }, [studentId]);

  if (banned) return <BannedPage />;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!job) return <div>Job not found</div>;
  if (!hasAccess) return <NotFoundPage />;

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData.entries());
    console.log(formFields);

    try {
      const response = await fetch(`http://localhost:5000/application`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formFields),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDeleteButton = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/job/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Login failed:", response.statusText);
        alert("Error");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="job-post">
        <h1>{job.name}</h1>
        <h2>Company name: {companyNameForView}</h2>
        <h3>Department name: {departmentName}</h3>

        <h3>Description: {job.description}</h3>
        <h3>Requirements: {job.requirements}</h3>
        <h3>Salary: {job.salary}</h3>
        <h3>Working hours: {job.working_hours}</h3>
      </div>

      {userName && companyName ? (
        <>
          <button onClick={handleDeleteButton} className="delete-button">
            <FontAwesomeIcon icon={faTrash} /> Delete
          </button>
          <Link to={`/company/${cId}/job/${jobId}/applicants`}>
            <button type="submit" class="company-button">
              View applicants
            </button>
          </Link>
        </>
      ) : userName ? (
        studentId ? (
          isApplicated ? (
            hasResponse ? (
              <>
                <p>Response: {hasResponse}</p>
                <p>Message: {applicationText}</p>
              </>
            ) : (
              <>
                <p>Message: {applicationText}</p>
              </>
            )
          ) : (
            <form onSubmit={handleFormSubmit}>
              <input type="hidden" name="studentId" value={studentId} />
              <input type="hidden" name="jobId" value={job.id} />
              <br />
              <label>
                <textarea
                  name="message"
                  rows="10"
                  cols="40"
                  placeholder="Write something:"
                />
              </label>
              <br />
              <button type="submit" class="auth-button">
                Send your application!
              </button>
            </form>
          )
        ) : (
          <Link to="/profile" class="auth-button">
            {" "}
            Give your data
          </Link>
        )
      ) : null}
    </div>
  );
};

export default MyApplications;
