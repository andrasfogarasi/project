import React from "react";
import { Link } from "react-router-dom";
import ProfileHeader from "../Headers/ProfileHeader";
import "./NotFoundPage.css";

const BannedPage = () => {
  return (
    <div>
      <ProfileHeader />
      <div className="container">
        <h1 className="text">You are banned</h1>
        <Link to="/" className="button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default BannedPage;
