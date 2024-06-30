import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./RegisterPage.css";
import RegisterStudent from "./RegisterStudent";

const RegisterPage = () => {
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
        {/* Add other routes here */}
      </Routes>
    </div>
  );
};

export default RegisterPage;
