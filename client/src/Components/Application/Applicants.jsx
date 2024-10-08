import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NotFoundPage from "../Error/NotFoundPage.jsx";
import { useParams } from "react-router-dom";
import Header from "../Headers/Header.jsx";
import BannedPage from "../Error/BannedPage.jsx";
import "./Applicants.css";

const Applicants = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const { jobId } = useParams();
  const [formData, setFormData] = useState({});
  const [banned, setBanned] = useState(false);

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/job/companyId/${jobId}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCompanyId(data[0].company_id);
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
          fetchCompanyId();
        }
      }
    }
  }, [jobId]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/applicant/job/${jobId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setApplicants(data);
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
            if (companyId === decodedToken.companyId.id) {
              setHasAccess(true);
            }
          }
        }
      }
    }

    fetchApplicants();
  }, [jobId, companyId]);

  const handleStatusChange = (id, status) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        status,
      },
    }));
  };

  const handleMessageChange = (id, message) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        message,
      },
    }));
  };

  const handleSubmit = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/application/response/${id}/job/${jobId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData[id]),
          credentials: "include",
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Submission failed:", response.statusText);
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
    <div className="wrapper">
      <Header />
      {applicants && applicants.length > 0 ? (
        applicants.map((applicant) => (
          <div key={applicant.id} className="job-post">
            <Link
              to={{
                pathname: `/profile/${applicant.id}`,
                state: { job: applicant },
              }}
            >
              <h2>{applicant.username}</h2>
              <h3>{applicant.message}</h3>
            </Link>
            <div className="action-buttons">
              <label>
                <input
                  type="radio"
                  name={`status-${applicant.id}`}
                  value="accepted"
                  onChange={() => handleStatusChange(applicant.id, "accepted")}
                  checked={formData[applicant.id]?.status === "accepted"}
                />
                ✔ Accept
              </label>
              <label>
                <input
                  type="radio"
                  name={`status-${applicant.id}`}
                  value="rejected"
                  onChange={() => handleStatusChange(applicant.id, "rejected")}
                  checked={formData[applicant.id]?.status === "rejected"}
                />
                ✘ Reject
              </label>
            </div>
            <textarea
              placeholder="Leave a message..."
              onChange={(e) =>
                handleMessageChange(applicant.id, e.target.value)
              }
              className="message-box"
              value={formData[applicant.id]?.message || ""}
            />
            <button
              type="button"
              onClick={() => handleSubmit(applicant.id)}
              className="submit-button"
            >
              Submit
            </button>
          </div>
        ))
      ) : (
        <p>No new applicants</p>
      )}
    </div>
  );
};

export default Applicants;
