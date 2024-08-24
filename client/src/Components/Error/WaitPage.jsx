import React from "react";
import ProfileHeader from "../Headers/ProfileHeader";
import "./NotFoundPage.css";

const WaitPage = () => {
  return (
    <div>
      <ProfileHeader />
      <div className="container">
        <h1 className="text">Wait for the admin's answer</h1>
      </div>
    </div>
  );
};

export default WaitPage;
