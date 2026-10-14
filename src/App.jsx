import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AskHelp from "./pages/AskHelp";
import HelpRequests from "./pages/HelpRequests";
import Profile from "./pages/Profile";
import Notes from "./pages/Notes";
import Home from "./Home.jsx";
import ProtectedRoute from "./ProtectedRoute";

function Header() {
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("loggedInUser"));
  } catch (error) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="main-header">
      <Link to="/home" className="brand">
        CampusConnect
      </Link>

      <nav className="main-nav">
        <Link to="/home">Home</Link>
        <Link to="/ask-help">Ask Help</Link>
        <Link to="/help-requests">Help Requests</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/profile">Profile</Link>

        {user ? (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/ask-help"
          element={
            <ProtectedRoute>
              <AskHelp />
            </ProtectedRoute>
          }
        />

        <Route
          path="/help-requests"
          element={
            <ProtectedRoute>
              <HelpRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;