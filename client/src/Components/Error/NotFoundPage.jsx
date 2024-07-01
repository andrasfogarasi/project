import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="container">
      <h1 className="header">404</h1>
      <p className="text">Page Not Found</p>
      <Link to="/" className="link">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
