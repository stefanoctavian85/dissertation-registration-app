import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function submitUsername(e) {
    setUsername(e.target.value);
  }

  function submitFirstname(e) {
    setFirstname(e.target.value);
  }

  function submitLastname(e) {
    setLastname(e.target.value);
  }

  function submitEmail(e) {
    setEmail(e.target.value);
  }

  function submitPassword(e) {
    setPassword(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!username || !firstname || !lastname || !password || !email) {
      setError("Please fill in all fields.");
      return;
    }

    const userCredentials = {
      username,
      firstname,
      lastname,
      email,
      password,
    };
    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again!");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <div className="register-container">
        <form id="form-register" onSubmit={handleSubmit}>
          <div className="register-item">
            <label>Username</label>
            <input
              type="text"
              id="usernameInput"
              placeholder="Enter username..."
              value={username}
              onChange={submitUsername}
            ></input>
          </div>
          <div className="register-item">
            <label>First name</label>
            <input
              type="text"
              id="firstnameInput"
              placeholder="Enter first name..."
              value={firstname}
              onChange={submitFirstname}
            ></input>
          </div>
          <div className="register-item">
            <label>Last name</label>
            <input
              type="text"
              id="lastnameInput"
              placeholder="Enter last name..."
              value={lastname}
              onChange={submitLastname}
            ></input>
          </div>
          <div className="register-item">
            <label>Email</label>
            <input
              type="email"
              id="emailInput"
              placeholder="Enter email..."
              value={email}
              onChange={submitEmail}
            ></input>
          </div>
          <div className="register-item">
            <label>Password</label>
            <input
              type="password"
              id="passwordInput"
              placeholder="Enter password..."
              value={password}
              onChange={submitPassword}
            ></input>
          </div>
          <button id="signin-button" type="submit">
            Sign in
          </button>
        </form>
      </div>
      {error && <p id="error-message">{error}</p>}
      {message && <p id="message">{message}</p>}
    </div>
  );
}

export default Register;
