import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosInstance";
import useAuth from "../hooks/useAuth";
import "../styles/auth.css"
import { FaUserCircle, FaLock } from "react-icons/fa";
import Footer from "../components/Footer";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const isAuthenticated = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the login request using axios
      const response = await axios.post("/auth/login", { email, password });

      // Handle successful login
      console.log("Login successful:", response.data);
      // Clear any previous errors
      setError(null);
      // Store the token in local storage
      localStorage.setItem("token", response.data.token);
      // Redirect to the home page
      navigate("/home")
    } catch (err) {
      // Catch any errors
      console.error("Error during login:", err);
      setError(err.response?.data?.error || "Invalid email or password");
    }
  };
  return (
    <div className="auth-page">
      <div className="content">
        <div className="container">
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <FaUserCircle className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <FaLock className="icon" />
            </div>
            <button type="submit">Login</button>
            {error ? <p>{error}</p> : null}
          </form>
          <div className="link">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="ancher">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
