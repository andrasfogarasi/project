import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Header.css";

const ProfileHeader = () => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);

      const now = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < now) {
        localStorage.removeItem("token");
      } else if (decodedToken) {
        if (decodedToken.flag === "3") {
          setUserName(decodedToken.name);
        }

        if (decodedToken.flag === "1") {
          setUserName("Admin");
        }
      }
    }
  }, []);

  return (
    <header className="header">
      <div>
        <nav className="nav">
          <ul className="nav-list">
            <li class="app-name-link">
              <Link to="/">StudWork</Link>
            </li>
            {userName && (
              <li class="active-link">
                <Link to="/login"> Logout</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default ProfileHeader;
