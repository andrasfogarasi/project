import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Header.css";

const ProfileHeader = () => {
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);

      const now = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < now) {
        localStorage.removeItem("token");
      } else if (decodedToken) {
        setIsUser(true);
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
            {isUser && (
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
