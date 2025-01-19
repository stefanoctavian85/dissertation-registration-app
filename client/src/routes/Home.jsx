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
            <h2>Colaborează ușor cu profesorii coordonatori</h2>
            <p>
              Găsește și comunică cu profesorul tău coordonator pentru a-ți
              dezvolta lucrarea de disertație.
            </p>
            <p>
              Trimite cereri direct din aplicație și primește răspunsuri în timp
              util
            </p>
          </section>

          <section className="section">
            <h2>Urmărește progresul cererilor</h2>
            <p>
              Ai acces la un tablou de bord personalizat unde poți verifica
              statusul cererilor trimise și detaliile despre profesorii care te
              ghidează.
            </p>
            <p>
              Planifică toate detaliile pentru susținerea lucrării de disertație
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
