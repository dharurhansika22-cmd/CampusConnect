import { Link, useNavigate } from "react-router-dom";
import "./app.css";

function Home() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="home-page">
      <main className="simple-hero">
        <span className="simple-label">YOUR STUDENT COMMUNITY</span>

        <h1>
          Connect. Collaborate.
          <br />
          <span>Learn Together.</span>
        </h1>

        <p>
          Have a doubt or need study notes? Connect with fellow students,
          share knowledge, and help each other learn.
        </p>

        <div className="simple-buttons">
          <Link to={loggedInUser ? "/ask-help" : "/login"}>
            <button type="button" className="simple-primary">
              Ask for Help
            </button>
          </Link>

          <Link to={loggedInUser ? "/help-requests" : "/register"}>
            <button type="button" className="simple-secondary">
              Help a Student
            </button>
          </Link>

          
        </div>
      </main>

      <section className="features-section">
        <h2>Learn Better, Together</h2>

        <p className="features-description">
          Everything you need to support your learning journey.
        </p>

        <div className="features">
          <div className="feature-card">
            <h3>Ask Questions</h3>
            <p>Get help with your doubts from other students.</p>
            <Link to={loggedInUser ? "/ask-help" : "/login"}>
              Ask for Help →
            </Link>
          </div>

          <div className="feature-card">
            <h3>Help Students</h3>
            <p>Share what you know and help your classmates.</p>
            <Link to={loggedInUser ? "/help-requests" : "/login"}>
              View Requests →
            </Link>
          </div>

          <div className="feature-card">
            <h3>Share Notes</h3>
            <p>Find useful notes and study materials.</p>
            <Link to={loggedInUser ? "/notes" : "/login"}>
              Explore Notes →
            </Link>
          </div>

          <div className="feature-card">
            <h3>AI Help</h3>
            <p>Get assistance with your study questions.</p>
            <Link to={loggedInUser ? "/help-requests" : "/login"}>
              Get Help →
            </Link>
          </div>
        </div>
      </section>

      <footer className="bottom-section">
        <h3>CampusConnect</h3>
        <p>Connect. Collaborate. Learn.</p>
      </footer>
    </div>
  );
}

export default Home;