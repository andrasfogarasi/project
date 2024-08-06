import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { jwtDecode } from "jwt-decode";
import { faUser, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  const [userName, setUserName] = useState(null);
  const [companyName, setCompanyName] = useState(null);

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
        } else if (decodedToken.flag === "2") {
          setCompanyName(decodedToken.companyName);
        } else if (decodedToken.flag === "4") {
          setUserName(decodedToken.name);
          setCompanyName(decodedToken.companyName);
        }
      }
    }
  }, []);

  return (
    <header className="header">
      <div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="app-name-link">
              <Link to="/">StudWork</Link>
            </li>
            {userName && companyName ? (
              <>
                <li className="active-link">
                  <Link to="/profile">
                    <FontAwesomeIcon icon={faUser} /> <p>{userName}</p>
                  </Link>
                </li>
                <li className="active-link">
                  <Link to="/company-profile">
                    <FontAwesomeIcon icon={faBuilding} />
                    <span className="profile-name">{companyName}</span>
                  </Link>
                </li>
              </>
            ) : userName ? (
              <li className="active-link">
                <Link to="/profile">
                  <FontAwesomeIcon icon={faUser} />{" "}
                  <span className="profile-name">{userName}</span>
                </Link>
              </li>
            ) : companyName ? (
              <li className="active-link">
                <Link to="/company-profile">
                  <FontAwesomeIcon icon={faBuilding} />
                  <span className="profile-name">{companyName}</span>
                </Link>
              </li>
            ) : (
              <>
                <li className="active-link">
                  <Link to="/login"> Login</Link>
                </li>
                <li className="active-link">
                  <Link to="/register"> Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
