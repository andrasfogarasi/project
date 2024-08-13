import "../Main/MainPage.css";
import React, { useState, useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import ProfileHeader from "../Headers/ProfileHeader.jsx";
import BannedPage from "../Error/BannedPage.jsx";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [banned, setBanned] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyData = async (companyId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/profile/company/${companyId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCompanyData(data[0]);
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
        if (decodedToken.flag === "2" || decodedToken.flag === "4") {
          if (decodedToken.banned) {
            setBanned(true);
          } else {
            setHasAccess(true);
            fetchCompanyData(decodedToken.companyId.id);
            setLoading(false);
            setCompanyId(decodedToken.companyId.id);
          }
        }
      }
    }
  }, []);

  const handleDeleteButton = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/company/${companyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        localStorage.clear();
        navigate("/");
      } else {
        console.error("Login failed:", response.statusText);
        alert("Error");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  if (banned) return <BannedPage />;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!hasAccess) return <NotFoundPage />;

  return (
    <div>
      <ProfileHeader />
      {companyData ? (
        <>
          <div className="job-post">
            <h1>{companyData.company_name}</h1>
            <h3>Email: {companyData.email}</h3>
            <h3>Location: {companyData.email}</h3>
            <h3>Telephone number: {companyData.tel_number}</h3>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete?")) {
                handleDeleteButton();
              }
            }}
            className="delete-button"
          >
            <FontAwesomeIcon icon={faTrash} /> Delete User
          </button>
        </>
      ) : null}
    </div>
  );
};

export default CompanyProfile;
