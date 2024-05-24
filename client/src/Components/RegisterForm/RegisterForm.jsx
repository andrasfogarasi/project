import React from "react";

const Register = () => {
  return (
    <div className="wrapper">
      <form action="/api/register" method="POST">
        <div className="input-box">
          <input type="text" placeholder="Username" name="username" required />
        </div>
        <div className="input-box">
          <input type="email" placeholder="Email" name="email" required />
        </div>
        <div className="input-box">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            required
          />
        </div>
        <div className="input-box">
          <input type="text" placeholder="Last Name" name="lastName" required />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
