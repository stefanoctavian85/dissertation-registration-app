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
            <h2>Collaborate easily with supervising teachers</h2>
            <p>
              Find and communicate with your supervising teacher
              to develop your dissertation.
            </p>
            <p>
              Send applications directly from the app and receive timely responses.
            </p>
          </section>

          <section className="section">
            <h2>Track your progress of your applications</h2>
            <p>
              Access a personalized dashboard where you can check the status of submitted applications
              and details about professors guiding you.
            </p>
            <p>
              Plan all the details for your disseratition.
            </p>
          </section>
        </main>
      ) : (
        <main className="main-content">
          <div className="not-logged-in">
            <h1>Bine ai venit!</h1>
            <p>
              Pentru a accesa aplicația, te rugăm să te loghezi sau să îți
              creezi un cont nou.
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
