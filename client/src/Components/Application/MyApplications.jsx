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
    const fetchJobPosts = async (studentId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/application/job/application/${studentId}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);

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
      console.log(studentId);
      fetchJobPosts(studentId);
    }
  }, [studentId]);

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

        <h3>Description: {jobPosts.description}</h3>
        <h3>Requirements: {jobPosts.requirements}</h3>
        <h3>Salary: {jobPosts.salary}</h3>
        <h3>Working hours: {jobPosts.working_hours}</h3>
      </div>
    </div>
  );
};

export default MyApplications;
