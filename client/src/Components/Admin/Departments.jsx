import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../Headers/Header.jsx";
import NotFoundPage from "../Error/NotFoundPage.jsx";

const Departments = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [formDepartmentData, setFormDepartmentData] = useState({
    name: "",
  });

  const handleDepartmentChange = (e) => {
    setFormDepartmentData({
      ...formDepartmentData,
      [e.target.name]: e.target.value,
    });
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

    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);

      const now = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < now) {
        localStorage.removeItem("token");
      } else if (decodedToken) {
        if (decodedToken.flag === "1") {
          setHasAccess(true);
          fetchDepartments();
        }
      }
    }
  }, []);

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/createNewDepartment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formDepartmentData),
          credentials: "include",
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Create new department failed:", response.statusText);
        alert("Error");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleDelete = async (departmentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/department/${departmentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete department");
      }

      setDepartments(
        departments.filter((department) => department.id !== departmentId)
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!hasAccess) return <NotFoundPage />;

  return (
    <div>
      <Header />

      <form onSubmit={handleDepartmentSubmit}>
        <div className="input-box">
          <input
            type="text"
            placeholder="Department name:"
            name="name"
            value={formDepartmentData.name}
            onChange={handleDepartmentChange}
            required
          />
        </div>

        <button type="submit">Add new department</button>
      </form>

      <div className="job-list">
        {departments.map((department) => (
          <div key={department.id} className="job-post">
            <h2>{department.department_name}</h2>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${department.department_name}?`
                  )
                ) {
                  handleDelete(department.id);
                }
              }}
              className="delete-button"
            >
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;
