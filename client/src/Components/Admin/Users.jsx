import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../Headers/Header.jsx";
import NotFoundPage from "../Error/NotFoundPage.jsx";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/user");
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
        if (decodedToken.flag === "1") {
          setHasAccess(true);
          fetchUsers();
        }
      }
    }
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user.id !== userId));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleBan = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/ban/${userId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to ban user");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/unblock/${userId}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to ban user");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

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
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${user.username}?`
                  )
                ) {
                  handleDelete(user.id);
                }
              }}
              className="delete-button"
            >
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
            {user.banned ? (
              <button onClick={() => handleUnblock(user.id)}>Unblock</button>
            ) : (
              <button onClick={() => handleBan(user.id)}>Ban</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
