import { useNavigate } from "react-router-dom";
import "./Home.css";
import NavLink from "../components/NavLink";
import homeImage from "../assets/home.png";
function Home({ isLoggedIn }) {
  return (
    <>
      {isLoggedIn ? (
        <main>
          <section className="section">
            <h2>Seamless collaboration with your professor</h2>
            <p>
              Find and communicate with your supervising professor to develop your dissertation.
            </p>
            <p>
              Apply directly from the app and receive immediate response.
            </p>
          </section>

          <section className="section">
            <h2>Track your progress of your applications</h2>
            <p>
              Access a personalised dashboard. See the status of your submitted applications and details of your supervising professors.
            </p>
            <p>
              Plan out all the essentials of your dissertation research.
            </p>
          </section>
        </main>
      ) : (
        <main className="main-content">
          <div className="not-logged-in">
            <h1>Welcome!</h1>
            <p>
              To access the application, please log in or create a new account!
            </p>
            <div className="not-logged-in-actions">
              <NavLink href="/login">Login</NavLink>
              <NavLink href="/register">Register</NavLink>
            </div>
            <div className="home-image">
              <img src={homeImage} alt="Collaboration illustration" />
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default Home;
