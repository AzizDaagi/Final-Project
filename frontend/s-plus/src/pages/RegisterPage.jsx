import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../axiosInstance";
import "../styles/auth.css"
import { FaUserCircle, FaLock } from "react-icons/fa";


function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the registration request using axios
      const response = await axios.post("/users/register", {
        email,
        password,
        name,
      });

      // Handle successful registration
      console.log("Registration successful:", response.data);
      setSuccess("Registration successful! You can now log in.");
      setError(null);

      navigate("/")

      // Optionally, redirect to login page or automatically log in the user
    } catch (err) {
      console.error("Error during registration:", err);
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
      setSuccess(null);
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
          className="name-input"
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-box">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="link">
        <p>
          Already have an account?{" "}
          <Link to="/" className="ancher">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
