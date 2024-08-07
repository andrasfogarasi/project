import "../Main/MainPage.css";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getTokenWithExpiry } from "../../Functions/tokenUtils.js";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import ProfileHeader from "../Headers/ProfileHeader.jsx";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [cId, setCompanyId] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async (companyId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/company/${companyId}`
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

    const token = getTokenWithExpiry("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken && decodedToken.flag)
          if (decodedToken.flag === "4" || decodedToken.flag === "2") {
            setHasAccess(true);
            setCompanyId(decodedToken.companyId);
            fetchCompanyData(decodedToken.companyId);
          }
      } catch (error) {
        console.error("Failed to decode token:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!hasAccess) return <NotFoundPage />;

  return (
    <div>
      <ProfileHeader />

      {cId && (
        <div className="profile-data">
          <h1>{companyData.company_name}</h1>
          <p>
            <strong>Email:</strong> {companyData.email}
          </p>
          <p>
            <strong>First Name:</strong> {companyData.tel_number}
          </p>
          <p>
            <strong>Last Name:</strong> {companyData.location}
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
