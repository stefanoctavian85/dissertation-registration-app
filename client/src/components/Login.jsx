import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ handleLoginStatus }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function submitUsername(e) {
    setUsername(e.target.value);
  }

  function submitPassword(e) {
    setPassword(e.target.value);
  }

  async function submitButton() {
    const userCredentials = {
      username,
      password,
    };

    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    });

    const data = await response.json();

    setMessage(data.message);

    if (data.success) {
      handleLoginStatus(true);
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      handleLoginStatus(false);
      localStorage.setItem("token", "");
    }

    setUsername("");
    setPassword("");
  }

  function registerButton() {
    navigate("/register");
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-header">Welcome Back</h1>
        <p className="login-subtitle">Login to access your account</p>
        <form className="login-form">
          <div className="login-input">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-input">
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-button" type="button" onClick={submitButton}>
            Login
          </button>
        </form>
        <p className="login-register">
          Don&apos;t have an account?{" "}
          <span
            onClick={registerButton}
            type="button"
            className="register-link"
          >
            Register
          </span>
        </p>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
