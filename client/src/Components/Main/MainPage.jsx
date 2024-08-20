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
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const fetchJobPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/job/active");
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

  const fetchAllJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/job/active");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      setError(error);
    }
  };

  const handleFilterJobs = async (selectedDepartment) => {
    let allJobs = await fetchAllJobs();
    const token = localStorage.getItem("token");
    let filteredJobs = [];

    if (token) {
      const decodedToken = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < now) {
        localStorage.removeItem("token");
        filteredJobs = allJobs;
      } else if (
        decodedToken &&
        (decodedToken.flag === "2" || decodedToken.flag === "4")
      ) {
        filteredJobs = await fetchJobPostsByCompanyId(
          decodedToken.companyId.id
        );
      }
    }

    filteredJobs = allJobs;

    if (selectedDepartment !== "0") {
      const selectedDepartmentNumber = Number(selectedDepartment);
      filteredJobs = filteredJobs.filter(
        (job) => job.department_id === selectedDepartmentNumber
      );
    }

    setJobPosts(filteredJobs);
    setCurrentPage(1);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobPosts.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(jobPosts.length / jobsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          onChange={async (e) => {
            const selectedValue = e.target.value;
            await setSelectedDepartment(selectedValue);

            if (selectedValue === "0") {
              fetchJobPosts();
            } else {
              console.log(selectedValue);
              handleFilterJobs(selectedValue);
            }
          }}
        >
          <option value="0">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.department_name}
            </option>
          ))}
        </select>
      </div>

      <div className="job-list">
        {currentJobs.map((job) => (
          <div key={job.id} className="job-post">
            <Link to={{ pathname: `/job/${job.id}`, state: { job } }}>
              <h2>{job.name}</h2>
            </Link>
            <h3>{job.company_name}</h3>
          </div>
        ))}
      </div>

      <div className="pagination">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={`page-button ${
              currentPage === number + 1 ? "active" : ""
            }`}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
