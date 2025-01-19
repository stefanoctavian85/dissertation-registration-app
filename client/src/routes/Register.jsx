import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
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
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-header">Create an Account</h1>
        <p className="login-subtitle">Register to access the platform</p>
        <form className="login-form">
          <div className="login-input">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              placeholder="Enter username..."
              value={username}
              onChange={submitUsername}
              required
            />
          </div>
          <div className="login-input">
            <label htmlFor="email-input">Email</label>
            <input
              id="email-input"
              type="email"
              placeholder="Enter email..."
              value={email}
              onChange={submitEmail}
              required
            />
          </div>
          <div className="login-input">
            <label htmlFor="firstname-input">First Name</label>
            <input
              id="firstname-input"
              type="text"
              placeholder="Enter first name..."
              value={firstname}
              onChange={submitFirstname}
              required
            />
          </div>
          <div className="login-input">
            <label htmlFor="lastname-input">Last Name</label>
            <input
              id="lastname-input"
              type="text"
              placeholder="Enter last name..."
              value={lastname}
              onChange={submitLastname}
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
              onChange={submitPassword}
              required
            />
          </div>
          <p className="login-register">
            Already have an account?{" "}
            <span
              onClick={() => {
                navigate("/login");
              }}
              type="button"
              className="register-link"
            >
              Sign in
            </span>
          </p>
          <button className="login-button" onClick={handleSubmit}>
            Register
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default Register;
