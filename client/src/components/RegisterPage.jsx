import React, { useState } from "react";
import "../styles/RegisterPage.css";
import { Navigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  async function handleRegister(ev) {
    console.log("Email:", email);
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Ev", ev);
    ev.preventDefault();

    const response = await fetch("https://blog-app-meena.onrender.com/user/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
      headers: { "Content-Type": "application/json" },
    });

    console.log("response", response);
    if (response.status === 400) {
      setErrMsg("Email ID already registered");
    } else if (response.status === 500) {
      setErrMsg("UserName already exists");
    } else if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="register-page">
      <h1>Register</h1>
      {errMsg && <div className="registerError">{errMsg}</div>}
      <div className="form-group">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
        />
      </div>
      <div className="form-group">
        <input
          type="username"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Username"
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
      </div>
      <button className="register-button" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
};

export default RegisterPage;
