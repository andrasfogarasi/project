import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "../Headers/Header.jsx";
import NotFoundPage from "../Error/NotFoundPage.jsx";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/company");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCompanies(data);
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

  const handleDelete = async (companyId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/company/${companyId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete company");
      }

      setCompanies(companies.filter((company) => company.id !== companyId));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const handleBan = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/company/ban/${userId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to ban company");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error banning company:", error);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/company/unblock/${userId}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to ban company");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error banning company:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!hasAccess) return <NotFoundPage />;

  return (
    <div>
      <Header />

      <div className="job-list">
        {companies.map((company) => (
          <div key={company.id} className="job-post">
            <Link
              to={{ pathname: `/job/${company.id}`, state: { job: company } }}
            >
              <h2>{company.company_name}</h2>
            </Link>
            <button onClick={() => handleDelete(company.id)}>Delete</button>
            {company.banned ? (
              <button onClick={() => handleUnblock(company.id)}>Unblock</button>
            ) : (
              <button onClick={() => handleBan(company.id)}>Ban</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
