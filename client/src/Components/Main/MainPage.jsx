import "./MainPage.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../Headers/Header.jsx";

const MainPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cId, setCompanyId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const fetchJobPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/job");
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
        `http://localhost:5000/job/company/${companyId}`
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

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:5000/department");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);

      const now = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < now) {
        localStorage.removeItem("token");
        fetchJobPosts();
      } else if (decodedToken) {
        if (decodedToken.flag === "2" || decodedToken.flag === "4") {
          fetchJobPostsByCompanyId(decodedToken.companyId.id);
          setCompanyId(decodedToken.companyId.id);
        } else {
          fetchJobPosts();
        }
        setLoading(false);
      }
    } else {
      fetchJobPosts();
    }
  }, []);

  const handleFilterJobs = async () => {
    let allJobs = [];

    const fetchAllJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/job");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        allJobs = await response.json();
      } catch (error) {
        setError(error);
      }
    };

    await fetchAllJobs();

    const token = localStorage.getItem("token");

    if (selectedDepartment === "0") {
      if (token) {
        const decodedToken = jwtDecode(token);

        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < now) {
          localStorage.removeItem("token");
          setJobPosts(allJobs);
        } else if (decodedToken) {
          if (decodedToken.flag === "2" || decodedToken.flag === "4") {
            await fetchJobPostsByCompanyId(decodedToken.companyId.id);
          } else {
            setJobPosts(allJobs);
          }
        }
      } else {
        setJobPosts(allJobs);
      }
    } else if (selectedDepartment) {
      const selectedDepartmentNumber = Number(selectedDepartment);

      const filteredJobs = allJobs.filter((job) => {
        return job.department_id === selectedDepartmentNumber;
      });

      setJobPosts(filteredJobs);
    } else {
      setJobPosts(allJobs);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Header />

      {cId ? (
        <div>
          <Link to={{ pathname: `/company/createJob` }}>
            <button className="new-job-button">
              <FontAwesomeIcon icon={faPlus} /> Add New Job
            </button>
          </Link>
        </div>
      ) : null}

      <div className="filter-section">
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="0">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.department_name}
            </option>
          ))}
        </select>
        <button onClick={handleFilterJobs}>Show</button>
      </div>

      <div className="job-list">
        {jobPosts.map((job) => (
          <div key={job.id} className="job-post">
            <Link to={{ pathname: `/job/${job.id}`, state: { job } }}>
              <h2>{job.name}</h2>
            </Link>
            <h3>{job.company_name}</h3>
            <h3>{job.department_id}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
