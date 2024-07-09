import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./RegisterPage.css";
import RegisterStudent from "./RegisterStudent";
import RegisterCompany from "./RegisterCompany";

const RegisterPage = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Registration Page</h1>
        <div>
          <Link to="/register/student">
            <button>Register as Student</button>
          </Link>
          <Link to="/register/company">
            <button>Register as Company</button>
          </Link>
        </div>
      </header>
      <Routes>
        <Route path="student" element={<RegisterStudent />} />
        <Route path="student" element={<RegisterCompany />} />
      </Routes>
    </div>
  );
};

export default RegisterPage;
