import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./RegisterPage.css";
import RegisterUser from "./RegisterUser";
import RegisterCompany from "./RegisterCompany";
import BasicHeader from "../Headers/BasicHeader.jsx";

const RegisterPage = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="wrapper">
      <BasicHeader />
      <header className="App-header">
        <h1>Registration Page</h1>
        <div>
          <Link to="/register/student">
            <button className="register-link">Register as User</button>
          </Link>
          <Link to="/register/company">
            <button className="register-link">Register a Company</button>
          </Link>
        </div>
      </header>
      <Routes>
        <Route path="student" element={<RegisterUser />} />
        <Route path="student" element={<RegisterCompany />} />
      </Routes>
    </div>
  );
};

export default RegisterPage;
