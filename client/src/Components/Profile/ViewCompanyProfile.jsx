import "../Main/MainPage.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../Headers/Header";

const ViewCompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { companyId } = useParams();

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

    fetchCompanyData(companyId);
  }, [companyId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Header />
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
