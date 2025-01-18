import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import MainHeaderBackground from "./MainHeaderBackground";

function Navbar({ isLoggedIn, handleLoginStatus }) {
  let navigate = useNavigate();

  function accountHandler() {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }

  function handleLoginLogout() {
    if (isLoggedIn) {
      handleLoginStatus(false);
      localStorage.setItem("token", "");
      localStorage.setItem("username", "");
      navigate("/");
    } else {
      navigate("/login");
    }
  }

  return (
    <header className="main-header">
      <MainHeaderBackground />
      <nav className="navbar" id="nav-bar">
        <div className="navbar-logo">
          <Link to="/">Dissertation App</Link>
        </div>
        <ul className="navbar-links">
          <li>
            <button className="navbar-button" onClick={accountHandler}>
              Your Account
            </button>
          </li>
          <li>
            <button
              className="navbar-button logout"
              onClick={handleLoginLogout}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
