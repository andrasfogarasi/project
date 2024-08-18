import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../Headers/Header.jsx";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import BannedPage from "../Error/BannedPage.jsx";

const MyApplications = () => {
  const location = useLocation();
  const { job: jobFromState } = location.state || {};
  const { jobId } = useParams();
  const [jobPosts, setJobPosts] = useState(jobFromState);
  const [loading, setLoading] = useState(!jobFromState);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [banned, setBanned] = useState(false);

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
    const fetchJobs = async (studentId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/application/job/${studentId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        if (data.length > 0) {
          setJobPosts(data);
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
      fetchJobs(studentId);
    }
  }, [studentId]);

  useEffect(() => {
    const fetchCompanyName = async (companyId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/company/${companyId}/name`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
      } catch (error) {
        setError(error);
      }
    };

    const fetchDepartment = async (departmentId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/department/${departmentId}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setDepartmentName(data[0].department_name);
      } catch (error) {
        setError(error);
      }
    };

    const token = localStorage.getItem("token");

    setHasAccess(true);

    if (job) {
      if (token) {
        const decodedToken = jwtDecode(token);

        if (decodedToken) {
          if (decodedToken.flag === "2" || decodedToken.flag === "4") {
            if (job.company_id !== cId) {
              setHasAccess(false);
            }
          }
        }
      }
      fetchCompanyName(jobPosts.company_id);
      fetchDepartment(jobPosts.department_id);
    }
  }, [job, cId]);

  if (banned) return <BannedPage />;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!jobPosts) return <div>Job not found</div>;
  if (!hasAccess) return <NotFoundPage />;

  return (
    <div>
      <Header />
      <div className="job-post">
        <h1>{jobPosts.name}</h1>
        <h2>Company name: {companyNameForView}</h2>
        <h3>Department name: {departmentName}</h3>

        <h3>Description: {jobPosts.description}</h3>
        <h3>Requirements: {jobPosts.requirements}</h3>
        <h3>Salary: {jobPosts.salary}</h3>
        <h3>Working hours: {jobPosts.working_hours}</h3>
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
              <input type="hidden" name="jobId" value={jobPosts.id} />
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
