import React from "react";
import { Link } from "react-router-dom";
import Header from "../Headers/Header.jsx";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div>
      <Header />
      <div className="container">
        <h1>404</h1>
        <p className="text">Page Not Found</p>
        <Link to="/" className="button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
