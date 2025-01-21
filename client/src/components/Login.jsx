import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      setTimeout(() => {
        localStorage.setItem("loginStatus", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        navigate("/");
      }, 1000);
    } else {
      localStorage.setItem("loginStatus", "false");
      localStorage.setItem("username", "");
      localStorage.setItem("token", "");
      setIsLoggedIn(false);
    }

    setUsername("");
    setPassword("");
  }

  function registerButton() {
    navigate("/register");
  }

  return (
    <div>
      <h1>Login</h1>
      <div id="login-container">
        <div className="login-item">
          <label>Username</label>
          <input
            type="text"
            id="usernameInput"
            placeholder="Enter username..."
            value={username}
            onChange={submitUsername}
          />
          <br />
        </div>
        <div className="login-item">
          <label>Password</label>
          <input
            type="password"
            id="passwordInput"
            placeholder="Enter password..."
            value={password}
            onChange={submitPassword}
          />
          <br />
        </div>
        <button id="login-button" onClick={submitButton}>
          Login
        </button>
        <p>You don't have an account?</p>
        <button id="register-button" onClick={registerButton}>
          Sign in
        </button>
      </div>
      <p id="message">{message}</p>
    </div>
  );
}

export default Login;
