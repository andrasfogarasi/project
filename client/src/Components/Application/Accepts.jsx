import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "../Headers/Header.jsx";
import NotFoundPage from "../Error/NotFoundPage.jsx";

const Accepts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const { jobId } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log(jobId);
        const response = await fetch(
          `http://localhost:5000/job/student/applicant/${jobId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        setUsers(data);
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
          setHasAccess(true);
          fetchUsers();
        }
      }
    }
  }, [jobId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!hasAccess) return <NotFoundPage />;

  return (
    <div>
      <Header />
      <div className="job-list">
        {users.map((user) => (
          <div key={user.id} className="job-post">
            <Link to={{ pathname: `/job/${user.id}`, state: { job: user } }}>
              <h2>{user.username}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accepts;
