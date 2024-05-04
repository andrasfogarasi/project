// import React, { useEffect, useState } from "react";
import LoginForm from "./Components/LoginForm/LoginForm";

function App() {

  return (
    <div>
      <LoginForm />
    </div>
  );

  /*
  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
      });
  }, []);

  return (
    <div>
      {typeof backendData.users === "undefined" ? (
        <p>Loading...</p>
      ) : (
        backendData.users.map((user, i) => <p key={i}>{user}</p>)
      )}
    </div>
  ); */
}

export default App;
