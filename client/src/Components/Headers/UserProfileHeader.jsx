import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Main/MainPage";
import { jwtDecode } from "jwt-decode";

const UserProfileHeader = () => {
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
      }
    }
  }, []);

  return (
    <header className="header">
      <div>
        <nav className="nav">
          <ul>
            <li class="active-link">
              <Link to="/">StudWork</Link>
            </li>
            {userName && (
              <li>
                <Link to="/login" class="active-link">
                  {" "}
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default UserProfileHeader;
