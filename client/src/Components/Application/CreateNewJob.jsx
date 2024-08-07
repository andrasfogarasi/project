import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import Header from "../Headers/Header.jsx";
import "./CreateNewJob.css";

const CreateNewJob = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [companyId, setcompanyId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    requirements: "",
    salary: "",
    workingHours: "",
    applicationLimit: "",
    departmentId: "",
    companyId: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);

      const now = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < now) {
        localStorage.removeItem("token");
      } else if (decodedToken) {
        if (decodedToken.flag === "2" || decodedToken.flag === "4") {
          setHasAccess(true);
          setcompanyId(decodedToken.companyId);
        }
      }
    }

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
  }, []);

  useEffect(() => {
    if (companyId) {
      setFormData((prevData) => ({
        ...prevData,
        companyId: companyId,
      }));
    }
  }, [companyId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/createNewJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Create new job failed:", response.statusText);
        alert("Error");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!hasAccess) return <NotFoundPage />;

  return (
    <div className="wrapper">
      <Header />
      <h1>Create new job</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <textarea
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            cols="40"
          />
        </div>
        <div className="input-box">
          <textarea
            placeholder="Requirement"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows="5"
            cols="40"
          />
        </div>
        <div className="input-box">
          <input
            type="number"
            placeholder="Salary (euro)"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="number"
            placeholder="Working hours"
            name="workingHours"
            value={formData.workingHours}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="number"
            placeholder="Number of positions"
            name="applicationLimit"
            value={formData.applicationLimit}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.department_name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add new job</button>
      </form>
    </div>
  );
};

export default CreateNewJob;
