import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import Register from "./components/Register.jsx";
import Request from "./components/Request.jsx";
import TeacherRequests from "./components/TeacherRequests.jsx";
import { useEffect, useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("loginStatus") === "true");
  }, []);

  const handleLoginStatus = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem("loginStatus", status ? "true" : "false");
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} handleLoginStatus={handleLoginStatus} />
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login handleLoginStatus={handleLoginStatus} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/request" element={<Request />} />
          <Route path="/teacher-requests" element={<TeacherRequests />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
