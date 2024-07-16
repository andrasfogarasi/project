import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./RegisterPage.css";
import RegisterUser from "./RegisterUser";
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
            <button>Register as User</button>
          </Link>
          <Link to="/register/company">
            <button>Register a Company</button>
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
