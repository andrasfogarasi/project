import React from "react";

const Register = () => {
  return (
    <div className="wrapper">
      <h1>Register</h1>
      <form action="/api/register" method="POST">
        <div className="input-box">
          <input type="text" placeholder="Username" name="username" required />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
