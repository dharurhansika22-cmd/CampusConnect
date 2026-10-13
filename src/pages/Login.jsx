
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://campusconnect-backend-iujm.onrender.com/users/login",
        { email, password }
      );

      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.status === 401
          ? "Invalid email or password"
          : "Login failed!"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">CampusConnect</div>
        <h1>Welcome Back 👋</h1>
        <p className="auth-subtitle">
          Login to continue learning and helping others.
        </p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <p className="auth-bottom">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
