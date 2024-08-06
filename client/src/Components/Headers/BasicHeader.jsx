import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const BasicHeader = () => {
  return (
    <header className="header">
      <div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="app-name-link">
              <Link to="/">StudWork</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default BasicHeader;
