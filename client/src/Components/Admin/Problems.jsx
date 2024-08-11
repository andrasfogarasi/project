import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "../Headers/Header.jsx";
import NotFoundPage from "../Error/NotFoundPage.jsx";

const Problems = () => {
  const [problems, setPromblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/problem");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setPromblems(data);
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
          fetchUsers();
        }
      }
    }
  }, []);

  const handleDelete = async (problemId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/company/${problemId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete problem");
      }

      setPromblems(problems.filter((problem) => problem.id !== problemId));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!hasAccess) return <NotFoundPage />;

  return (
    <div>
      <Header />
      <div className="job-list">
        {problems.map((problem) => (
          <div key={problem.id} className="job-post">
            <h2>{problem.company_name}</h2>
            <button onClick={() => handleDelete(problem.id)}>Solved!</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems;
