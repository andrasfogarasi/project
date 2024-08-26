import "../Main/MainPage.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import ProfileHeader from "../Headers/ProfileHeader.jsx";

const ViewCompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const { companyId } = useParams();

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
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken && decodedToken.flag) {
          if (decodedToken.banned) {
            setBanned(true);
          } else {
            setHasAccess(true);
            setUserName(decodedToken.name);
            fetchUserData(profileId);
            fetchStudentData(profileId);
          }
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        setError(new Error("Invalid token"));
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError(new Error("No token found"));
    }
  }, []);

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
            <h3>Location: {companyData.location}</h3>
            <h3>Telephone number: {companyData.tel_number}</h3>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ViewCompanyProfile;
